import React, { useState, useEffect } from "react";
import {
  Layers,
  X,
  Sparkles,
  Link2,
  Hash,
  FileText,
  ImageIcon,
  SortAsc,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
  Brain,
  Eye,
  Microscope,
  Pill,
  GraduationCap,
  Activity,
  FolderTree,
} from "lucide-react";

// Curated list of popular medical / catalog icons
const POPULAR_ICONS = [
  { id: "Stethoscope", label: "Stethoscope", Icon: Stethoscope },
  { id: "HeartPulse", label: "Heart Pulse", Icon: HeartPulse },
  { id: "Brain", label: "Neurology", Icon: Brain },
  { id: "Eye", label: "Ophthalmology", Icon: Eye },
  { id: "Microscope", label: "Research", Icon: Microscope },
  { id: "Pill", label: "Pharmacy", Icon: Pill },
  { id: "GraduationCap", label: "Academic", Icon: GraduationCap },
  { id: "Activity", label: "Activity", Icon: Activity },
];

export const INITIAL_STREAM_FORM = {
  name: "",
  code: "",
  slug: "",
  description: "",
  icon: "Stethoscope",
  image: "",
  parentStream: "",
  displayOrder: 0,
  status: "active",
};

const StreamModal = ({
  isOpen,
  onClose,
  onSubmit,
  streamForm,
  setStreamForm,
  editingStream,
  allStreams = [],
}) => {
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (editingStream) {
      setAutoSlug(false);
    } else {
      setAutoSlug(true);
    }
  }, [editingStream]);

  if (!isOpen) return null;

  const handleNameChange = (val) => {
    const updated = { ...streamForm, name: val };
    if (autoSlug) {
      updated.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    // Auto-suggest code if empty and not editing
    if (!editingStream && (!streamForm.code || streamForm.code.length <= 4)) {
      const codeSuggestion = val
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 5);
      if (codeSuggestion) updated.code = codeSuggestion;
    }
    setStreamForm(updated);
  };

  // Filter out the stream itself from parent choices to avoid circular ref
  const availableParents = allStreams.filter(
    (s) => !editingStream || s._id !== editingStream._id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {editingStream ? "Edit Academic Stream" : "Create Academic Stream"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Schema Compliant
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Mongoose Stream Schema · Academic discipline hierarchy & classification
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body (Scrollable) */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-sm text-slate-800">
          {/* SECTION 1: Primary Stream Identification */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>1. Stream Title & Identifiers</span>
            </div>

            {/* Stream Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Stream Title / Discipline Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Medical Sciences (Allopathy) or Dental Surgery"
                value={streamForm.name || ""}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-xs"
              />
            </div>

            {/* Stream Code & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>Unique Stream Code</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. MED, BDS, AYUSH"
                  value={streamForm.code || ""}
                  onChange={(e) =>
                    setStreamForm({ ...streamForm, code: e.target.value.toUpperCase().trim() })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Unique uppercase identifier used in reports & matrices
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>URL Slug</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSlug(!autoSlug);
                      if (!autoSlug && streamForm.name) {
                        setStreamForm({
                          ...streamForm,
                          slug: streamForm.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)+/g, ""),
                        });
                      }
                    }}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold"
                  >
                    {autoSlug ? "Manual Slug" : "Auto-Generate"}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. medical-sciences"
                  value={streamForm.slug || ""}
                  readOnly={autoSlug}
                  onChange={(e) => setStreamForm({ ...streamForm, slug: e.target.value })}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-slate-800 font-mono text-xs transition ${
                    autoSlug
                      ? "bg-slate-100/70 border-slate-200 text-slate-600"
                      : "bg-white border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Hierarchy & Display Configuration */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <FolderTree className="w-4 h-4 text-indigo-600" />
              <span>2. Hierarchy, Ordering & Status</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Parent Stream */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Parent Stream
                </label>
                <select
                  value={streamForm.parentStream || ""}
                  onChange={(e) =>
                    setStreamForm({
                      ...streamForm,
                      parentStream: e.target.value || null,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  <option value="">None (Primary Top-Level)</option>
                  {availableParents.map((parent) => (
                    <option key={parent._id} value={parent._id}>
                      {parent.name} ({parent.code || "NO-CODE"})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Select if this is a sub-discipline
                </span>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <SortAsc className="w-3.5 h-3.5 text-slate-400" />
                  <span>Display Priority</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={streamForm.displayOrder ?? 0}
                  onChange={(e) =>
                    setStreamForm({
                      ...streamForm,
                      displayOrder: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Lower numbers appear first (0 = top)
                </span>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Stream Status
                </label>
                <select
                  value={streamForm.status || "active"}
                  onChange={(e) =>
                    setStreamForm({ ...streamForm, status: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Inactive streams are hidden from candidate choice cart
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: Visual & Media Assets */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>3. Visual Icon & Banner Image</span>
            </div>

            {/* Popular Icon Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Stream Icon Identifier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {POPULAR_ICONS.map(({ id, label, Icon }) => {
                  const isSelected = streamForm.icon === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setStreamForm({ ...streamForm, icon: id })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2.5">
                <input
                  type="text"
                  placeholder="Or enter custom icon name (e.g. Stethoscope, Heart, Activity)"
                  value={streamForm.icon || ""}
                  onChange={(e) => setStreamForm({ ...streamForm, icon: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Image Banner URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Stream Banner / Thumbnail Image URL</span>
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={streamForm.image || ""}
                onChange={(e) => setStreamForm({ ...streamForm, image: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
              {streamForm.image && (
                <div className="mt-2.5 flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                  <img
                    src={streamForm.image}
                    alt="Stream preview"
                    className="w-16 h-12 object-cover rounded-lg border border-slate-100"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <span className="text-xs text-slate-500 truncate">
                    Live banner preview
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: Description & Scope */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>4. Academic Scope & Description</span>
            </div>
            <textarea
              rows={3}
              placeholder="Provide a comprehensive summary of this medical/healthcare discipline, governing councils (e.g. NMC, DCI, CCIM), and career pathways..."
              value={streamForm.description || ""}
              onChange={(e) => setStreamForm({ ...streamForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-xs text-slate-500">
              <span className="text-rose-500">*</span> Mandatory fields required by Mongoose schema
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingStream ? "Update Stream" : "Save Stream"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StreamModal;
