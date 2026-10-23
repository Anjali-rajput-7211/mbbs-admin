import React from "react";
import {
  GraduationCap,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  ShieldCheck,
  FileText,
  X,
  Check,
  Plus,
  Trash2,
  Award,
  Compass,
  Star,
  CheckCircle2,
} from "lucide-react";

export const UNIVERSITY_TYPES = [
  { value: "central", label: "Central University" },
  { value: "state", label: "State University" },
  { value: "private", label: "Private University" },
  { value: "deemed", label: "Deemed-to-be University" },
  { value: "international", label: "International University" },
  { value: "other", label: "Other / Autonomous Institution" },
];

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const INITIAL_UNIVERSITY_FORM = {
  name: "",
  shortName: "",
  slug: "",
  logo: "",
  description: "",
  type: "state",
  establishedYear: 1980,
  recognition: [{ name: "UGC", year: 1980 }],
  accreditation: [{ name: "NAAC", grade: "A+", score: "3.55", year: 2023 }],
  location: {
    address: "",
    city: "",
    state: "Delhi",
    country: "India",
    pincode: "",
    coordinates: {
      latitude: "",
      longitude: "",
    },
  },
  contact: {
    email: "",
    phone: "",
  },
  website: "",
  status: "active",
  isVerified: true,
};

const UniversityModal = ({
  isOpen,
  onClose,
  onSubmit,
  universityForm,
  setUniversityForm,
  editingUniversity,
  submitting = false,
}) => {
  if (!isOpen) return null;

  // Recognition list helpers
  const handleAddRecognition = () => {
    const list = Array.isArray(universityForm.recognition) ? [...universityForm.recognition] : [];
    list.push({ name: "", year: new Date().getFullYear() });
    setUniversityForm({ ...universityForm, recognition: list });
  };

  const handleUpdateRecognition = (index, field, value) => {
    const list = Array.isArray(universityForm.recognition) ? [...universityForm.recognition] : [];
    list[index] = { ...list[index], [field]: value };
    setUniversityForm({ ...universityForm, recognition: list });
  };

  const handleRemoveRecognition = (index) => {
    const list = (universityForm.recognition || []).filter((_, i) => i !== index);
    setUniversityForm({ ...universityForm, recognition: list });
  };

  // Accreditation list helpers
  const handleAddAccreditation = () => {
    const list = Array.isArray(universityForm.accreditation) ? [...universityForm.accreditation] : [];
    list.push({ name: "", grade: "A+", score: "", year: new Date().getFullYear() });
    setUniversityForm({ ...universityForm, accreditation: list });
  };

  const handleUpdateAccreditation = (index, field, value) => {
    const list = Array.isArray(universityForm.accreditation) ? [...universityForm.accreditation] : [];
    list[index] = { ...list[index], [field]: value };
    setUniversityForm({ ...universityForm, accreditation: list });
  };

  const handleRemoveAccreditation = (index) => {
    const list = (universityForm.accreditation || []).filter((_, i) => i !== index);
    setUniversityForm({ ...universityForm, accreditation: list });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {editingUniversity ? "Edit University Record" : "Register University"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Schema Aligned
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Accredited medical universities, statutory approvals & state boards
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

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-sm text-slate-800">
          {/* SECTION 1: Basic University Identity */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>1. Basic University Identity</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  University Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. All India Institute of Medical Sciences"
                  value={universityForm.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = !editingUniversity
                      ? name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
                      : universityForm.slug;
                    setUniversityForm({ ...universityForm, name, slug: autoSlug });
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Short Name / Acronym
                </label>
                <input
                  type="text"
                  placeholder="e.g. AIIMS / KGMU"
                  value={universityForm.shortName || ""}
                  onChange={(e) => setUniversityForm({ ...universityForm, shortName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Slug / URL Key
                </label>
                <input
                  type="text"
                  placeholder="e.g. aiims-new-delhi"
                  value={universityForm.slug || ""}
                  onChange={(e) => setUniversityForm({ ...universityForm, slug: e.target.value.toLowerCase().trim() })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  University Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={universityForm.type || "state"}
                  onChange={(e) => setUniversityForm({ ...universityForm, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  {UNIVERSITY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Established Year</span>
                </label>
                <input
                  type="number"
                  min="1800"
                  max="2099"
                  placeholder="1956"
                  value={universityForm.establishedYear ?? ""}
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      establishedYear: e.target.value ? Number(e.target.value) : "",
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Official Logo Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={universityForm.logo || ""}
                  onChange={(e) => setUniversityForm({ ...universityForm, logo: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-xs"
                />
              </div>

              {universityForm.logo && (
                <div className="flex items-center gap-2 pt-2 sm:pt-6">
                  <div className="w-10 h-10 rounded-xl border border-slate-200 overflow-hidden bg-white p-1 flex items-center justify-center shrink-0">
                    <img
                      src={universityForm.logo}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">Logo preview</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>About / University Description</span>
              </label>
              <textarea
                rows={3}
                placeholder="Comprehensive overview of university history, research recognition, faculties, and medical college affiliations..."
                value={universityForm.description || ""}
                onChange={(e) => setUniversityForm({ ...universityForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none text-xs"
              />
            </div>
          </div>

          {/* SECTION 2: Geographic Location & Coordinates */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>2. Campus Location & Coordinates</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus Postal Address
              </label>
              <input
                type="text"
                placeholder="e.g. Sri Aurobindo Marg, Ansari Nagar"
                value={universityForm.location?.address || ""}
                onChange={(e) =>
                  setUniversityForm({
                    ...universityForm,
                    location: { ...universityForm.location, address: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="New Delhi"
                  value={universityForm.location?.city || ""}
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      location: { ...universityForm.location, city: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  State <span className="text-rose-500">*</span>
                </label>
                <select
                  value={universityForm.location?.state || "Delhi"}
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      location: { ...universityForm.location, state: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="110029"
                  value={universityForm.location?.pincode || ""}
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      location: { ...universityForm.location, pincode: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={universityForm.location?.country || "India"}
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      location: { ...universityForm.location, country: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  <span>GPS Latitude</span>
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 28.5672"
                  value={universityForm.location?.coordinates?.latitude ?? ""}
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      location: {
                        ...universityForm.location,
                        coordinates: {
                          ...universityForm.location?.coordinates,
                          latitude: e.target.value ? Number(e.target.value) : "",
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  <span>GPS Longitude</span>
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 77.2100"
                  value={universityForm.location?.coordinates?.longitude ?? ""}
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      location: {
                        ...universityForm.location,
                        coordinates: {
                          ...universityForm.location?.coordinates,
                          longitude: e.target.value ? Number(e.target.value) : "",
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Contact & Web Information */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Phone className="w-4 h-4 text-indigo-600" />
              <span>3. Contact & Web Presence</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Official Email</span>
                </label>
                <input
                  type="email"
                  placeholder="registrar@university.edu.in"
                  value={universityForm.contact?.email || ""}
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      contact: { ...universityForm.contact, email: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Phone</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 11 2658 8500"
                  value={universityForm.contact?.phone || ""}
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      contact: { ...universityForm.contact, phone: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Official Website</span>
                </label>
                <input
                  type="url"
                  placeholder="https://www.university.edu.in"
                  value={universityForm.website || ""}
                  onChange={(e) => setUniversityForm({ ...universityForm, website: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Statutory Recognition & Accreditations (Dynamic Arrays) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recognition Array */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Recognition (UGC, NMC, etc.)</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddRecognition}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer border border-indigo-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {(!universityForm.recognition || universityForm.recognition.length === 0) ? (
                <div className="p-3 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                  No statutory recognition added yet. Click Add above.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {universityForm.recognition.map((rec, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <input
                        type="text"
                        placeholder="Body (e.g. UGC / NMC)"
                        value={rec.name || ""}
                        onChange={(e) => handleUpdateRecognition(index, "name", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-semibold"
                      />
                      <input
                        type="number"
                        placeholder="Year (1956)"
                        value={rec.year ?? ""}
                        onChange={(e) => handleUpdateRecognition(index, "year", e.target.value ? Number(e.target.value) : "")}
                        className="w-24 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRecognition(index)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accreditation Array */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <Star className="w-4 h-4 text-indigo-600" />
                  <span>Accreditation (NAAC, NIRF, etc.)</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddAccreditation}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer border border-indigo-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {(!universityForm.accreditation || universityForm.accreditation.length === 0) ? (
                <div className="p-3 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                  No accreditations registered. Click Add above.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {universityForm.accreditation.map((acc, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <input
                        type="text"
                        placeholder="Agency (NAAC)"
                        value={acc.name || ""}
                        onChange={(e) => handleUpdateAccreditation(index, "name", e.target.value)}
                        className="w-24 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Grade (A++)"
                        value={acc.grade || ""}
                        onChange={(e) => handleUpdateAccreditation(index, "grade", e.target.value)}
                        className="w-20 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-indigo-600 font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Score (3.85)"
                        value={acc.score || ""}
                        onChange={(e) => handleUpdateAccreditation(index, "score", e.target.value)}
                        className="w-20 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <input
                        type="number"
                        placeholder="Year"
                        value={acc.year ?? ""}
                        onChange={(e) => handleUpdateAccreditation(index, "year", e.target.value ? Number(e.target.value) : "")}
                        className="w-18 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAccreditation(index)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 5: Status & Verification */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Listing Status:
              </label>
              <select
                value={universityForm.status || "pending"}
                onChange={(e) => setUniversityForm({ ...universityForm, status: e.target.value })}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="active">Active (Visible)</option>
                <option value="pending">Pending (Review)</option>
                <option value="inactive">Inactive (Disabled)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(universityForm.isVerified)}
                onChange={(e) => setUniversityForm({ ...universityForm, isVerified: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mark as Officially Verified University</span>
              </span>
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-xs text-slate-500">
              <span className="text-rose-500">*</span> Mandatory university fields
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
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? "Saving..." : editingUniversity ? "Update University" : "Save University"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniversityModal;
