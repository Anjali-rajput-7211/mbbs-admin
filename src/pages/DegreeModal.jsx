import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  X,
  Sparkles,
  Link2,
  Hash,
  FileText,
  Clock,
  Layers,
  SortAsc,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

export const INITIAL_DEGREE_FORM = {
  name: "",
  shortName: "",
  code: "",
  slug: "",
  level: "undergraduate",
  degreeType: "professional",
  durationValue: 5,
  durationUnit: "years",
  streams: [],
  displayOrder: 0,
  status: "active",
  description: "",
};

const DEGREE_LEVELS = [
  { value: "undergraduate", label: "Undergraduate (UG)" },
  { value: "postgraduate", label: "Postgraduate (PG / MD / MS)" },
  { value: "doctoral", label: "Doctoral (DM / MCh / PhD)" },
  { value: "diploma", label: "Postgraduate Diploma" },
  { value: "certificate", label: "Certificate Course" },
  { value: "postdoctoral", label: "Postdoctoral Fellowship" },
  { value: "other", label: "Other Level" },
];

const DEGREE_TYPES = [
  { value: "professional", label: "Professional Clinical" },
  { value: "academic", label: "Academic / Theoretical" },
  { value: "research", label: "Research Oriented" },
  { value: "vocational", label: "Vocational / Paramedical" },
  { value: "other", label: "Other Classification" },
];

const DegreeModal = ({
  isOpen,
  onClose,
  onSubmit,
  degreeForm,
  setDegreeForm,
  editingDegree,
  allStreams = [],
}) => {
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (editingDegree) {
      setAutoSlug(false);
    } else {
      setAutoSlug(true);
    }
  }, [editingDegree]);

  if (!isOpen) return null;

  const handleNameChange = (val) => {
    const updated = { ...degreeForm, name: val };
    if (autoSlug) {
      updated.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    setDegreeForm(updated);
  };

  const handleShortNameChange = (val) => {
    const uppercaseVal = val.toUpperCase();
    const updated = { ...degreeForm, shortName: uppercaseVal };
    if (!degreeForm.code || degreeForm.code === degreeForm.shortName) {
      updated.code = uppercaseVal;
    }
    setDegreeForm(updated);
  };

  const toggleStreamSelection = (streamId) => {
    const current = degreeForm.streams || [];
    if (current.includes(streamId)) {
      setDegreeForm({
        ...degreeForm,
        streams: current.filter((id) => id !== streamId),
      });
    } else {
      setDegreeForm({
        ...degreeForm,
        streams: [...current, streamId],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {editingDegree ? "Edit Academic Degree" : "Create Academic Degree"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Schema Compliant
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Mongoose Degree Schema · Statutory qualifications, duration & streams
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

        {/* Modal Form Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-sm text-slate-800">
          {/* SECTION 1: Degree Nomenclature */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>1. Degree Nomenclature & Identity</span>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Degree Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bachelor of Medicine and Bachelor of Surgery"
                value={degreeForm.name || ""}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-xs"
              />
            </div>

            {/* Short Name, Code, Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Short Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS, BDS, MD"
                  value={degreeForm.shortName || ""}
                  onChange={(e) => handleShortNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>Unique Code</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. MBBS"
                  value={degreeForm.code || ""}
                  onChange={(e) =>
                    setDegreeForm({ ...degreeForm, code: e.target.value.toUpperCase().trim() })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Slug</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. mbbs"
                  value={degreeForm.slug || ""}
                  onChange={(e) => setDegreeForm({ ...degreeForm, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Academic Level & Duration */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>2. Level, Classification & Statutory Duration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Level <span className="text-rose-500">*</span>
                </label>
                <select
                  value={degreeForm.level || "undergraduate"}
                  onChange={(e) => setDegreeForm({ ...degreeForm, level: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  {DEGREE_LEVELS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Degree Type
                </label>
                <select
                  value={degreeForm.degreeType || "professional"}
                  onChange={(e) => setDegreeForm({ ...degreeForm, degreeType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  {DEGREE_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default Duration Value
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="10"
                  value={degreeForm.durationValue ?? 5}
                  onChange={(e) =>
                    setDegreeForm({ ...degreeForm, durationValue: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Duration Unit
                </label>
                <select
                  value={degreeForm.durationUnit || "years"}
                  onChange={(e) => setDegreeForm({ ...degreeForm, durationUnit: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={degreeForm.status || "active"}
                  onChange={(e) => setDegreeForm({ ...degreeForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: Applicable Streams */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>3. Applicable Academic Streams</span>
            </div>
            <p className="text-xs text-slate-500">
              Select one or more streams that award this degree (e.g. Medical Sciences for MBBS):
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {allStreams.map((stream) => {
                const isSelected = (degreeForm.streams || []).includes(stream._id);
                return (
                  <button
                    key={stream._id}
                    type="button"
                    onClick={() => toggleStreamSelection(stream._id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <span>{stream.name}</span>
                    {stream.code && (
                      <span
                        className={`text-[10px] px-1 rounded ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {stream.code}
                      </span>
                    )}
                  </button>
                );
              })}
              {allStreams.length === 0 && (
                <span className="text-xs text-slate-400 italic">
                  No streams created yet. You can associate streams later.
                </span>
              )}
            </div>
          </div>

          {/* SECTION 4: Description */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>4. Description & Career Scope</span>
            </div>
            <textarea
              rows={3}
              placeholder="Official description of the degree, eligibility framework, curriculum structure..."
              value={degreeForm.description || ""}
              onChange={(e) => setDegreeForm({ ...degreeForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-xs text-slate-500">
              <span className="text-rose-500">*</span> Required by Degree Schema
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
                <span>{editingDegree ? "Update Degree" : "Save Degree"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DegreeModal;
