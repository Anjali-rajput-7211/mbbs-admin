import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ShieldCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  UserCheck,
  RefreshCw,
  AlertCircle,
  Users,
} from "lucide-react";

const API = "http://localhost:5000";

export default function RolesTab({ showToast }) {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Modal states
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: [],
    status: "active",
  });

  // Assign Role modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    userId: "",
    role: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch roles, permissions, and users
  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        axios.get(`${API}/getAllRoles`, getAuthHeaders()),
        axios.get(`${API}/getPermissions`, getAuthHeaders()),
      ]);

      if (rolesRes.data.success) {
        setRoles(rolesRes.data.data || []);
      }
      if (permsRes.data.success) {
        setPermissions(permsRes.data.data || []);
      }

      // Fetch users for assignment
      try {
        const usersRes = await axios.get(`${API}/getAllUsers`, getAuthHeaders());
        if (usersRes.data.success) {
          setUsers(usersRes.data.data || []);
        }
      } catch (uErr) {
        // Fallback to getAllAdmins
        const adminsRes = await axios.get(`${API}/getAllAdmins`, getAuthHeaders());
        if (adminsRes.data.success) {
          setUsers(adminsRes.data.data || []);
        }
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || "Failed to load roles", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group permissions by category for clear UI
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const cat = perm.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(perm);
    return acc;
  }, {});

  // Toggle single permission checkbox
  const togglePermission = (permId) => {
    setRoleForm((prev) => {
      const exists = prev.permissions.includes(permId);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permId)
          : [...prev.permissions, permId],
      };
    });
  };

  // Select/Deselect all permissions in a category
  const toggleCategoryAll = (categoryPerms) => {
    const permIds = categoryPerms.map((p) => p.id);
    const allSelected = permIds.every((id) => roleForm.permissions.includes(id));

    setRoleForm((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((id) => !permIds.includes(id))
        : Array.from(new Set([...prev.permissions, ...permIds])),
    }));
  };

  // Operational permissions excluding "Role" (SuperAdmin governance)
  const operationalPermIds = permissions
    .filter((p) => p.category !== "Role")
    .map((p) => p.id);

  const areAllOperationalSelected =
    operationalPermIds.length > 0 &&
    operationalPermIds.every((id) => roleForm.permissions.includes(id));

  // Toggle All Operational Permissions with * wildcard (excludes SuperAdmin role permissions)
  const toggleAllOperational = () => {
    setRoleForm((prev) => {
      if (areAllOperationalSelected) {
        // Deselect all operational permissions
        return {
          ...prev,
          permissions: prev.permissions.filter(
            (id) => !operationalPermIds.includes(id) && id !== "*"
          ),
        };
      } else {
        // Select all operational permissions + '*' wildcard
        const remaining = prev.permissions.filter((id) => !operationalPermIds.includes(id));
        return {
          ...prev,
          permissions: Array.from(new Set([...remaining, ...operationalPermIds, "*"])),
        };
      }
    });
  };

  // Open Create Role modal
  const handleOpenCreate = () => {
    setEditingRole(null);
    setRoleForm({
      name: "",
      description: "",
      permissions: [],
      status: "active",
    });
    setShowRoleModal(true);
  };

  // Open Edit Role modal
  const handleOpenEdit = (role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name || "",
      description: role.description || "",
      permissions: Array.isArray(role.permissions) ? role.permissions : [],
      status: role.status || "active",
    });
    setShowRoleModal(true);
  };

  // Save Role (Create or Update)
  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleForm.name.trim()) {
      if (showToast) showToast("Role name is required", "error");
      return;
    }

    try {
      if (editingRole) {
        const res = await axios.put(`${API}/updateRole/${editingRole._id}`, roleForm, getAuthHeaders());
        if (res.data.success) {
          if (showToast) showToast("Role updated successfully!", "success");
          setShowRoleModal(false);
          fetchData();
        }
      } else {
        const res = await axios.post(`${API}/addRole`, roleForm, getAuthHeaders());
        if (res.data.success) {
          if (showToast) showToast("New role created successfully!", "success");
          setShowRoleModal(false);
          fetchData();
        }
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  // Delete Role
  const handleDeleteRole = async (role) => {
    if (role.isSuperAdmin) {
      if (showToast) showToast("Super Admin role cannot be deleted", "error");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete role '${role.name}'?`)) return;

    try {
      const res = await axios.delete(`${API}/deleteRole/${role._id}`, getAuthHeaders());
      if (res.data.success) {
        if (showToast) showToast("Role deleted successfully", "success");
        fetchData();
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  // Assign Role to user
  const handleAssignRole = async (e) => {
    e.preventDefault();
    if (!assignForm.userId || !assignForm.role) {
      if (showToast) showToast("Please select both a User and a Role", "error");
      return;
    }

    try {
      const res = await axios.post(`${API}/assignRole`, assignForm, getAuthHeaders());
      if (res.data.success) {
        if (showToast) showToast(res.data.message || "Role assigned successfully!", "success");
        setShowAssignModal(false);
        setAssignForm({ userId: "", role: "" });
        fetchData();
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || "Failed to assign role", "error");
    }
  };

  // Filter roles by search
  const filteredRoles = roles.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header / Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAssignModal(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Assign Role</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-sm shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Role</span>
          </button>

          <button
            onClick={fetchData}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Roles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRoles.map((role) => (
          <div
            key={role._id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {role.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      {role.isSuperAdmin ? "System Master Role" : "Custom Staff Role"}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    role.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {role.status || "active"}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                {role.description || "No description provided for this role."}
              </p>

              {/* Permissions summary badge count */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">Granted Permissions</span>
                  <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {role.isSuperAdmin
                      ? "All (SuperAdmin Access)"
                      : role.permissions?.includes("*")
                      ? "All Operational (*)"
                      : `${role.permissions?.length || 0} permissions`}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(role)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Permissions</span>
              </button>

              {!role.isSuperAdmin && (
                <button
                  onClick={() => handleDeleteRole(role)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                  title="Delete Role"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRoles.length === 0 && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">No Roles Found</h4>
          <p className="text-xs text-slate-500 mt-1">
            Create a custom role and assign permissions to manage staff access.
          </p>
        </div>
      )}

      {/* CREATE / EDIT ROLE MODAL */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingRole ? `Edit Role: ${editingRole.name}` : "Create New Role"}
                </h3>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Counselling Admin, College Admin"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={roleForm.status}
                    onChange={(e) => setRoleForm({ ...roleForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Role Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Explain what this role is responsible for..."
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Permissions Checklist Grouped by 9 Core Entities */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Assign Permissions ({roleForm.permissions.length} selected)
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Click category title to toggle all in that section
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleAllOperational}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border shadow-2xs ${
                      areAllOperationalSelected
                        ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                        : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                    }`}
                  >
                    <span className="font-mono text-sm font-black">*</span>
                    <span>
                      {areAllOperationalSelected
                        ? "Deselect All Operational (*)"
                        : "Select All Operational (*)"}
                    </span>
                  </button>
                </div>

                <div className="mb-2 p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-800 flex items-center gap-2">
                  <span className="text-base leading-none">ℹ️</span>
                  <span>
                    <strong>* (All Permissions):</strong> Grants full access to all operational modules (Students, Colleges, Academics, Applications, Emails). SuperAdmin governance is strictly excluded.
                  </span>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                  {Object.entries(groupedPermissions).map(([category, perms]) => {
                    const allCatSelected = perms.every((p) => roleForm.permissions.includes(p.id));
                    const isRoleCategory = category === "Role";

                    return (
                      <div key={category} className="bg-white rounded-xl border border-slate-200 p-3">
                        <div
                          onClick={() => toggleCategoryAll(perms)}
                          className="flex items-center justify-between cursor-pointer pb-2 border-b border-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                              {category}
                            </span>
                            {isRoleCategory && (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md">
                                SuperAdmin Only • Excluded from *
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-indigo-600 hover:underline">
                            {allCatSelected ? "Deselect All" : "Select All"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5">
                          {perms.map((perm) => {
                            const isChecked = roleForm.permissions.includes(perm.id);

                            return (
                              <label
                                key={perm.id}
                                className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                                  isChecked
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-900 font-bold"
                                    : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm.id)}
                                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <div className="min-w-0">
                                  <div className="leading-tight">{perm.name}</div>
                                  <div className="text-[10px] text-slate-400 font-normal line-clamp-1">
                                    {perm.description}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  {editingRole ? "Update Role" : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN ROLE MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Assign Role to User</h3>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignRole} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select User / Officer *
                </label>
                <select
                  required
                  value={assignForm.userId}
                  onChange={(e) => setAssignForm({ ...assignForm, userId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose User --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email}) — Current Role: {u.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Role to Assign *
                </label>
                <select
                  required
                  value={assignForm.role}
                  onChange={(e) => setAssignForm({ ...assignForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose Role --</option>
                  {roles.map((r) => (
                    <option key={r._id} value={r.name}>
                      {r.name} ({r.permissions?.length || 0} permissions)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
