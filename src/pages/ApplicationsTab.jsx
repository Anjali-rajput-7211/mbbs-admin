import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Award,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Trash2,
  Mail,
  Edit2,
  Building2,
  Landmark,
  GraduationCap,
  BookOpen,
  Stethoscope,
  RefreshCw,
  Send,
} from "lucide-react";

const API = "http://localhost:5000";

export default function ApplicationsTab({ showToast, hasPermission }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);

  // Status Update & Email Template selection modal
  const [updatingApp, setUpdatingApp] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: "under_review",
    remarks: "",
    emailTemplateId: "",
  });
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedTemplatePreview, setSelectedTemplatePreview] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/getAllApplications`, {
        ...getAuthHeaders(),
        params: {
          search: search || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        },
      });
      if (res.data.success) {
        setApplications(res.data.data || []);
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || "Failed to fetch applications", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch email templates for notification selection
  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API}/getAllEmailTemplates`, getAuthHeaders());
      if (res.data.success) {
        setEmailTemplates(res.data.data || []);
      }
    } catch (e) {
      // Fallback silently if not available
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchTemplates();
  }, [statusFilter]);

  // Handle open status update modal
  const handleOpenStatusModal = (app) => {
    setUpdatingApp(app);
    setStatusForm({
      status: app.status || "under_review",
      remarks: app.remarks || "",
      emailTemplateId: "",
    });
    setSelectedTemplatePreview(null);
  };

  // When email template is selected, preview variable replacement
  const handleTemplateChange = (templateId) => {
    setStatusForm((prev) => ({ ...prev, emailTemplateId: templateId }));
    if (!templateId) {
      setSelectedTemplatePreview(null);
      return;
    }

    const tpl = emailTemplates.find((t) => t._id === templateId);
    if (tpl && updatingApp) {
      const studentName = updatingApp.studentName || "Student";
      const applicationId = updatingApp.applicationNo || "APP-2026-1000";
      const collegeName = updatingApp.college?.name || "Medical College";
      const universityName = updatingApp.university?.name || "University";

      const replaceVars = (text) => {
        if (!text) return "";
        return text
          .replace(/\{\{studentName\}\}/g, studentName)
          .replace(/\{\{applicationId\}\}/g, applicationId)
          .replace(/\{\{collegeName\}\}/g, collegeName)
          .replace(/\{\{universityName\}\}/g, universityName);
      };

      setSelectedTemplatePreview({
        title: tpl.title,
        subject: replaceVars(tpl.subject || tpl.title),
        body: replaceVars(tpl.description || tpl.body || ""),
      });
    }
  };

  // Save status change
  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!updatingApp) return;

    try {
      const res = await axios.put(
        `${API}/updateApplicationStatus/${updatingApp._id}`,
        statusForm,
        getAuthHeaders()
      );
      if (res.data.success) {
        if (showToast) showToast(res.data.message || "Application status updated!", "success");
        setUpdatingApp(null);
        fetchApplications();
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || "Failed to update status", "error");
    }
  };

  // Delete application
  const handleDeleteApplication = async (app) => {
    if (!window.confirm(`Are you sure you want to delete application ${app.applicationNo}?`)) return;

    try {
      const res = await axios.delete(`${API}/deleteApplication/${app._id}`, getAuthHeaders());
      if (res.data.success) {
        if (showToast) showToast("Application deleted", "success");
        fetchApplications();
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  // Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved
          </span>
        );
      case "allotted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Award className="w-3.5 h-3.5 text-indigo-600" /> Seat Allotted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by application no, candidate name, email, roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </form>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Application Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="allotted">Seat Allotted</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={fetchApplications}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3 px-4">Application No</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">NEET Details</th>
                <th className="py-3 px-4">University & College</th>
                <th className="py-3 px-4">Academic Choice</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {app.applicationNo}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{app.studentName}</div>
                    <div className="text-xs text-slate-500">{app.studentEmail}</div>
                    {app.studentPhone && (
                      <div className="text-[11px] text-slate-400">{app.studentPhone}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-medium">
                    <div>
                      <span className="text-slate-400 text-xs">Score:</span>{" "}
                      <span className="font-bold text-indigo-600">{app.neetScore || "N/A"}</span>
                    </div>
                    {app.neetRank > 0 && (
                      <div className="text-xs text-slate-500">Rank: #{app.neetRank}</div>
                    )}
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      {app.category || "General"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 line-clamp-1">
                      {app.college?.name || "College not set"}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1">
                      {app.university?.name || "University"}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">
                      {app.degree?.shortName || app.degree?.name || "Degree"}
                    </div>
                    <div className="text-xs text-slate-500">
                      Stream: {app.stream?.name || "Medical"}
                    </div>
                    {app.specialization?.name && (
                      <div className="text-xs text-indigo-600 font-medium">
                        Spec: {app.specialization.name}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>

                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
                      title="Inspect Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {(!hasPermission || hasPermission("edit_applications")) && (
                      <button
                        onClick={() => handleOpenStatusModal(app)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        title="Update Status / Notify"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}

                    {(!hasPermission || hasPermission("delete_applications")) && (
                      <button
                        onClick={() => handleDeleteApplication(app)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && !loading && (
          <div className="p-12 text-center">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No Applications Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Applications submitted by students will appear in this registry.
            </p>
          </div>
        )}
      </div>

      {/* INSPECT APPLICATION MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Application Details
                  </h3>
                  <span className="font-mono text-xs font-bold text-indigo-600">
                    {selectedApp.applicationNo}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {/* Status Header */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-600">Current Status</span>
                <div>{getStatusBadge(selectedApp.status)}</div>
              </div>

              {/* Student Details */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h4 className="font-extrabold uppercase text-[11px] text-slate-500 tracking-wider">
                  Student Information
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Name:</span>{" "}
                    <span className="font-bold text-slate-900">{selectedApp.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span>{" "}
                    <span className="font-semibold text-slate-800">{selectedApp.studentEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Phone:</span>{" "}
                    <span className="font-semibold text-slate-800">{selectedApp.studentPhone || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Category:</span>{" "}
                    <span className="font-bold text-slate-900">{selectedApp.category || "General"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">NEET Roll No:</span>{" "}
                    <span className="font-mono font-bold text-slate-900">{selectedApp.neetRollNumber || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">NEET Score:</span>{" "}
                    <span className="font-bold text-indigo-600">{selectedApp.neetScore || 0}</span>
                  </div>
                </div>
              </div>

              {/* Academic Hierarchy */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h4 className="font-extrabold uppercase text-[11px] text-slate-500 tracking-wider">
                  Applied University & College Hierarchy
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-400">University:</span>
                    <span className="font-bold text-slate-900">{selectedApp.university?.name || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-400">College:</span>
                    <span className="font-bold text-slate-900">{selectedApp.college?.name || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-400">Degree:</span>
                    <span className="font-bold text-slate-900">
                      {selectedApp.degree?.name} ({selectedApp.degree?.shortName})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-400">Stream:</span>
                    <span className="font-bold text-slate-900">{selectedApp.stream?.name || "Medical"}</span>
                  </div>
                  {selectedApp.specialization?.name && (
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-slate-400">Specialization:</span>
                      <span className="font-bold text-indigo-600">{selectedApp.specialization.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Remarks */}
              {selectedApp.remarks && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700">Remarks:</span>
                  <p className="text-slate-600 mt-1">{selectedApp.remarks}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE STATUS & EMAIL NOTIFICATION MODAL */}
      {updatingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                Update Status — {updatingApp.applicationNo}
              </h3>
              <button
                onClick={() => setUpdatingApp(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Application Status *
                </label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="allotted">Seat Allotted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Internal Remarks / Reason
                </label>
                <textarea
                  rows="2"
                  placeholder="Add evaluation note or review feedback..."
                  value={statusForm.remarks}
                  onChange={(e) => setStatusForm({ ...statusForm, remarks: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Reusable Email Template Selection (Requirements 16, 17, 18) */}
              <div className="border-t border-slate-200 pt-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Send Email Notification (Optional)
                </label>
                <select
                  value={statusForm.emailTemplateId}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- No Email Notification --</option>
                  {emailTemplates.map((tpl) => (
                    <option key={tpl._id} value={tpl._id}>
                      {tpl.title}
                    </option>
                  ))}
                </select>

                {/* Email Template Preview with Variables Replaced */}
                {selectedTemplatePreview && (
                  <div className="mt-3 p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs space-y-1.5">
                    <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Email Preview (Variables replaced):</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-600">Subject:</span>{" "}
                      <span className="font-bold text-slate-800">{selectedTemplatePreview.subject}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-indigo-100 text-slate-700 whitespace-pre-wrap font-sans text-xs">
                      {selectedTemplatePreview.body}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUpdatingApp(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Status</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
