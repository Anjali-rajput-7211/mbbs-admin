import React, { useState, useEffect } from "react";
import {
  Sparkles,
  X,
  Link2,
  Hash,
  FileText,
  Clock,
  BookOpen,
  Briefcase,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export const INITIAL_SPECIALIZATION_FORM = {
  name: "",
  code: "",
  slug: "",
  course: "",
  durationValue: 3,
  durationUnit: "years",
  minimumPercentage: 55,
  requiredSubjects: "General Medicine, Pathology, Anatomy",
  requiredQualification: "MBBS recognized by National Medical Commission (NMC)",
  careerOptions: "Specialist Consultant, Department Head, Clinical Researcher",
  description: "",
  status: "active",
};

const SpecializationModal = ({
  isOpen,
  onClose,
  onSubmit,
  specializationForm,
  setSpecializationForm,
  editingSpecialization,
  allCourses = [],
}) => {
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (editingSpecialization) {
      setAutoSlug(false);
    } else {
      setAutoSlug(true);
    }
  }, [editingSpecialization]);

  if (!isOpen) return null;

  const handleNameChange = (val) => {
    const updated = { ...specializationForm, name: val };
    if (autoSlug) {
      updated.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    setSpecializationForm(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {editingSpecialization
                    ? "Edit Clinical Specialization"
                    : "Create Clinical Specialization"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Schema Compliant
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Mongoose Specialization Schema · Super-specialty & clinical career focus
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
          {/* SECTION 1: Specialization Identity */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>1. Specialization Title & Discipline</span>
            </div>

            {/* Specialization Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Specialization Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. General Surgery, Pediatrics, Cardiology, Radio-Diagnosis"
                value={specializationForm.name || ""}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-xs"
              />
            </div>

            {/* Code & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>Specialization Code</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. SURG-GEN, PED"
                  value={specializationForm.code || ""}
                  onChange={(e) =>
                    setSpecializationForm({
                      ...specializationForm,
                      code: e.target.value.toUpperCase().trim(),
                    })
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
                  placeholder="e.g. general-surgery"
                  value={specializationForm.slug || ""}
                  onChange={(e) =>
                    setSpecializationForm({ ...specializationForm, slug: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Course Linkage & Duration */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>2. Parent Course & Duration</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Parent Course <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={specializationForm.course || ""}
                onChange={(e) =>
                  setSpecializationForm({ ...specializationForm, course: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                <option value="">Select Parent Academic Course...</option>
                {allCourses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code || "NO-CODE"})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duration Value</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="10"
                  value={specializationForm.durationValue ?? 3}
                  onChange={(e) =>
                    setSpecializationForm({
                      ...specializationForm,
                      durationValue: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Duration Unit
                </label>
                <select
                  value={specializationForm.durationUnit || "years"}
                  onChange={(e) =>
                    setSpecializationForm({ ...specializationForm, durationUnit: e.target.value })
                  }
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
                  value={specializationForm.status || "active"}
                  onChange={(e) =>
                    setSpecializationForm({ ...specializationForm, status: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: Eligibility & Career Options */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>3. Eligibility & Career Pathways</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Career Options & Roles (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Chief Surgeon, Surgical Consultant, Clinical Researcher, Academic Faculty"
                value={specializationForm.careerOptions || ""}
                onChange={(e) =>
                  setSpecializationForm({
                    ...specializationForm,
                    careerOptions: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Min Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={specializationForm.minimumPercentage ?? 55}
                  onChange={(e) =>
                    setSpecializationForm({
                      ...specializationForm,
                      minimumPercentage: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Prerequisite Qualification
                </label>
                <input
                  type="text"
                  placeholder="e.g. MBBS degree recognized by NMC with completed internship"
                  value={specializationForm.requiredQualification || ""}
                  onChange={(e) =>
                    setSpecializationForm({
                      ...specializationForm,
                      requiredQualification: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Description */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>4. Clinical Description & Residency Scope</span>
            </div>
            <textarea
              rows={3}
              placeholder="Outline surgical/clinical scope, patient care obligations, and residency training modules..."
              value={specializationForm.description || ""}
              onChange={(e) =>
                setSpecializationForm({ ...specializationForm, description: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-xs text-slate-500">
              <span className="text-rose-500">*</span> Required by Specialization Schema
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
                <span>
                  {editingSpecialization
                    ? "Update Specialization"
                    : "Save Specialization"}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecializationModal;
