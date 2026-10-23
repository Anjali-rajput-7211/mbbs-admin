import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Mail,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Calendar,
  Sparkles,
} from "lucide-react";
import CKEditorComponent from "./CKEditorComponent";

const API = "http://localhost:5000";

const EmailTemplatesTab = ({ onTemplatesUpdated }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Add Form State (Only Title & Description)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);

  // Edit Modal State (Only Title & Description)
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch Templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/email-templates`, getAuthHeaders());
      if (res.data.success) {
        const list = res.data.data || [];
        setTemplates(list);
        if (onTemplatesUpdated) {
          onTemplatesUpdated(list.length);
        }
      }
    } catch (err) {
      console.error("Fetch templates error:", err);
      showToast(err.response?.data?.message || "Failed to load templates", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Filter templates by Search (Title or Description)
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates;
    const q = searchQuery.toLowerCase();
    return templates.filter((tpl) => {
      const t = (tpl.title || tpl.name || "").toLowerCase();
      const d = (tpl.description || tpl.bodyHtml || "").toLowerCase();
      return t.includes(q) || d.includes(q);
    });
  }, [templates, searchQuery]);

  // Add New Template (Only Title & Description)
  const handleAddTemplate = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Please enter a template title", "error");
      return;
    }

    if (!description.trim()) {
      showToast("Please enter a template description", "error");
      return;
    }

    try {
      setAdding(true);
      const res = await axios.post(
        `${API}/api/email-templates`,
        {
          title: title.trim(),
          description: description.trim(),
        },
        getAuthHeaders()
      );

      if (res.data.success) {
        showToast("Email template added successfully!", "success");
        setTitle("");
        setDescription("");
        fetchTemplates();
      }
    } catch (err) {
      console.error("Add template error:", err);
      showToast(err.response?.data?.message || "Failed to add email template", "error");
    } finally {
      setAdding(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (template) => {
    setEditingTemplate(template);
    setEditTitle(template.title || template.name || "");
    setEditDescription(template.description || template.bodyHtml || "");
  };

  // Save Edit (Only Title & Description)
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editTitle.trim()) {
      showToast("Template title cannot be empty", "error");
      return;
    }

    if (!editDescription.trim()) {
      showToast("Template description cannot be empty", "error");
      return;
    }

    try {
      setSaving(true);
      const res = await axios.put(
        `${API}/api/email-templates/${editingTemplate._id}`,
        {
          title: editTitle.trim(),
          description: editDescription.trim(),
        },
        getAuthHeaders()
      );

      if (res.data.success) {
        showToast("Email template updated successfully!", "success");
        setEditingTemplate(null);
        fetchTemplates();
      }
    } catch (err) {
      console.error("Update template error:", err);
      showToast(err.response?.data?.message || "Failed to update template", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete Template
  const handleDelete = async (template) => {
    const templateTitle = template.title || template.name || "this template";
    if (!window.confirm(`Are you sure you want to delete "${templateTitle}"?`)) {
      return;
    }

    try {
      const res = await axios.delete(
        `${API}/api/email-templates/${template._id}`,
        getAuthHeaders()
      );
      if (res.data.success) {
        showToast("Email template deleted successfully", "success");
        fetchTemplates();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete template", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold border animate-in fade-in slide-in-from-top-4 duration-200 ${
            toast.type === "error"
              ? "bg-rose-900/90 text-rose-100 border-rose-700"
              : "bg-emerald-900/90 text-emerald-100 border-emerald-700"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Admissions Desk</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Email Templates
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Manage email notifications by adding title and description.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Templates
            </span>
            <span className="text-xl font-black text-indigo-400 font-mono">
              {templates.length}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ADD EMAIL TEMPLATE CARD (ONLY TITLE & DESCRIPTION) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Add New Email Template</h2>
            <p className="text-xs text-slate-500">Enter title and description to save a new template</p>
          </div>
        </div>

        <form onSubmit={handleAddTemplate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Welcome Candidate / Seat Allotment Confirmation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description (Rich Text Content) *
            </label>
            <CKEditorComponent
              value={description}
              onChange={(data) => setDescription(data)}
              placeholder="Enter template description or email message text with rich formatting..."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={adding || !title.trim() || !description.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>{adding ? "Adding Template..." : "Add Email Template"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ======================================================== */}
      {/* SEARCH BAR & TEMPLATES LIST */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <span className="text-xs font-bold text-slate-500">
            Showing {filteredTemplates.length} of {templates.length} templates
          </span>
        </div>

        {/* Loading / Empty / Cards List */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-600">Loading email templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No email templates found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? `No templates matched "${searchQuery}". Try a different keyword.`
                : "Add your first email template above using the title and description form."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredTemplates.map((template) => {
              const displayTitle = template.title || template.name || "Untitled Template";
              const displayDescription = template.description || template.bodyHtml || "No description provided";
              const formattedDate = template.createdAt
                ? new Date(template.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : null;

              return (
                <div
                  key={template._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-indigo-300 transition-all duration-200 card-hover flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Date & Actions */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate ? `Added ${formattedDate}` : "Active"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(template)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                          title="Edit Title & Description"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(template)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {displayTitle}
                    </h3>

                    {/* Description (Formatted HTML) */}
                    <div
                      className="rich-description text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4 overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: displayDescription }}
                    />
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                      Email Template
                    </span>

                    <button
                      onClick={() => handleOpenEdit(template)}
                      className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition cursor-pointer flex items-center gap-1"
                    >
                      <span>Edit</span>
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* EDIT TEMPLATE MODAL (ONLY TITLE & DESCRIPTION) */}
      {/* ======================================================== */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Email Template</h3>
                  <p className="text-xs text-slate-500">Update title and description</p>
                </div>
              </div>
              <button
                onClick={() => setEditingTemplate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Template Title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description (Rich Text Content) *
                </label>
                <CKEditorComponent
                  value={editDescription}
                  onChange={(data) => setEditDescription(data)}
                  placeholder="Edit template description or email content..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !editTitle.trim() || !editDescription.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer disabled:opacity-50"
                >
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplatesTab;
