import React from "react";
import {
  Building2,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  ShieldCheck,
  FileText,
  X,
  CheckCircle2,
  Plus,
  Trash2,
  Award,
  Star,
  Compass,
} from "lucide-react";

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

export const OWNERSHIP_OPTIONS = [
  "Central Government",
  "State Government",
  "Autonomous Body (INI)",
  "Trust / Society",
  "Private University",
  "Deemed University Trust",
  "Public-Private Partnership (PPP)",
];

export const INITIAL_COLLEGE_FORM = {
  name: "",
  slug: "",
  logo: "",
  description: "",
  university: "",
  collegeType: "government",
  ownership: "State Government",
  establishedYear: 1985,
  location: {
    address: "",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    pincode: "",
    coordinates: {
      latitude: "",
      longitude: "",
    },
  },
  website: "",
  contact: {
    email: "",
    phone: "",
  },
  accreditation: [{ name: "NMC", grade: "Recognized", year: 1985 }],
  ranking: [{ organization: "NIRF", rank: 1, year: 2024 }],
  rating: {
    average: 4.8,
    count: 240,
  },
  status: "active",
  isVerified: true,
};

const CollegeModal = ({
  isOpen,
  onClose,
  onSubmit,
  collegeForm,
  setCollegeForm,
  editingCollege,
  universities = [],
  submitting = false,
}) => {
  if (!isOpen) return null;

  // Accreditation helpers
  const handleAddAccreditation = () => {
    const list = Array.isArray(collegeForm.accreditation) ? [...collegeForm.accreditation] : [];
    list.push({ name: "", grade: "", year: new Date().getFullYear() });
    setCollegeForm({ ...collegeForm, accreditation: list });
  };

  const handleUpdateAccreditation = (index, field, value) => {
    const list = Array.isArray(collegeForm.accreditation) ? [...collegeForm.accreditation] : [];
    list[index] = { ...list[index], [field]: value };
    setCollegeForm({ ...collegeForm, accreditation: list });
  };

  const handleRemoveAccreditation = (index) => {
    const list = (collegeForm.accreditation || []).filter((_, i) => i !== index);
    setCollegeForm({ ...collegeForm, accreditation: list });
  };

  // Ranking helpers
  const handleAddRanking = () => {
    const list = Array.isArray(collegeForm.ranking) ? [...collegeForm.ranking] : [];
    list.push({ organization: "NIRF", rank: 10, year: new Date().getFullYear() });
    setCollegeForm({ ...collegeForm, ranking: list });
  };

  const handleUpdateRanking = (index, field, value) => {
    const list = Array.isArray(collegeForm.ranking) ? [...collegeForm.ranking] : [];
    list[index] = { ...list[index], [field]: value };
    setCollegeForm({ ...collegeForm, ranking: list });
  };

  const handleRemoveRanking = (index) => {
    const list = (collegeForm.ranking || []).filter((_, i) => i !== index);
    setCollegeForm({ ...collegeForm, ranking: list });
  };

  const loc = collegeForm.location || {};
  const coords = loc.coordinates || {};
  const contact = collegeForm.contact || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {editingCollege ? "Edit Medical College" : "Register Medical College"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  College Schema
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Accredited medical colleges, university affiliations & seat allocation profile
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
          {/* SECTION 1: Institutional Identity */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>1. Institutional Identity & Affiliation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Official College Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. All India Institute of Medical Sciences (AIIMS)"
                  value={collegeForm.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = !editingCollege
                      ? name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
                      : collegeForm.slug;
                    setCollegeForm({ ...collegeForm, name, slug: autoSlug });
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Slug / URL Key
                </label>
                <input
                  type="text"
                  placeholder="aiims-new-delhi"
                  value={collegeForm.slug || ""}
                  onChange={(e) => setCollegeForm({ ...collegeForm, slug: e.target.value.toLowerCase().trim() })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* University Affiliation, Type & Ownership */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>Affiliated University</span>
                </label>
                <select
                  value={collegeForm.university || ""}
                  onChange={(e) => setCollegeForm({ ...collegeForm, university: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  <option value="">-- Standalone / Select University --</option>
                  {universities.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} {u.shortName ? `(${u.shortName})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  College Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={collegeForm.collegeType || "government"}
                  onChange={(e) => setCollegeForm({ ...collegeForm, collegeType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  <option value="government">Government Medical College</option>
                  <option value="private">Private Medical College</option>
                  <option value="deemed">Deemed University</option>
                  <option value="autonomous">Autonomous Institute (INI)</option>
                  <option value="public">Public University College</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ownership Body
                </label>
                <input
                  type="text"
                  list="ownership-options"
                  placeholder="e.g. State Government"
                  value={collegeForm.ownership || ""}
                  onChange={(e) => setCollegeForm({ ...collegeForm, ownership: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
                <datalist id="ownership-options">
                  {OWNERSHIP_OPTIONS.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  value={collegeForm.establishedYear ?? ""}
                  onChange={(e) =>
                    setCollegeForm({
                      ...collegeForm,
                      establishedYear: e.target.value ? Number(e.target.value) : "",
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Logo Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/college-logo.png"
                  value={collegeForm.logo || ""}
                  onChange={(e) => setCollegeForm({ ...collegeForm, logo: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Description / Overview</span>
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary of campus hospital, seat matrix, attached medical beds and history..."
                value={collegeForm.description || ""}
                onChange={(e) => setCollegeForm({ ...collegeForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
              />
            </div>
          </div>

          {/* SECTION 2: Location & GPS Coordinates */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>2. College Location & Coordinates</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Address Line
              </label>
              <input
                type="text"
                placeholder="e.g. Sri Aurobindo Marg, Ansari Nagar"
                value={loc.address || collegeForm.address || ""}
                onChange={(e) =>
                  setCollegeForm({
                    ...collegeForm,
                    address: e.target.value,
                    location: { ...loc, address: e.target.value },
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
                  value={loc.city || collegeForm.city || ""}
                  onChange={(e) =>
                    setCollegeForm({
                      ...collegeForm,
                      city: e.target.value,
                      location: { ...loc, city: e.target.value },
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
                  value={loc.state || collegeForm.state || "Delhi"}
                  onChange={(e) =>
                    setCollegeForm({
                      ...collegeForm,
                      state: e.target.value,
                      location: { ...loc, state: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
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
                  value={loc.pincode || collegeForm.pincode || ""}
                  onChange={(e) =>
                    setCollegeForm({
                      ...collegeForm,
                      pincode: e.target.value,
                      location: { ...loc, pincode: e.target.value },
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
                  value={loc.country || collegeForm.country || "India"}
                  onChange={(e) =>
                    setCollegeForm({
                      ...collegeForm,
                      country: e.target.value,
                      location: { ...loc, country: e.target.value },
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
                  placeholder="28.5672"
                  value={coords.latitude ?? ""}
                  onChange={(e) =>
                    setCollegeForm({
                      ...collegeForm,
                      location: {
                        ...loc,
                        coordinates: { ...coords, latitude: e.target.value ? Number(e.target.value) : "" },
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
                  placeholder="77.2100"
                  value={coords.longitude ?? ""}
                  onChange={(e) =>
                    setCollegeForm({
                      ...collegeForm,
                      location: {
                        ...loc,
                        coordinates: { ...coords, longitude: e.target.value ? Number(e.target.value) : "" },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Contact & Links */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Phone className="w-4 h-4 text-indigo-600" />
              <span>3. Contact Information & Portal</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admissions Email</span>
                </label>
                <input
                  type="email"
                  placeholder="admissions@aiims.edu"
                  value={contact.email || collegeForm.email || ""}
                  onChange={(e) =>
                    setCollegeForm({
                      ...collegeForm,
                      email: e.target.value,
                      contact: { ...contact, email: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 11 2658 8500"
                  value={contact.phone || collegeForm.phone || ""}
                  onChange={(e) =>
                    setCollegeForm({
                      ...collegeForm,
                      phone: e.target.value,
                      contact: { ...contact, phone: e.target.value },
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
                  placeholder="https://www.aiims.edu"
                  value={collegeForm.website || ""}
                  onChange={(e) => setCollegeForm({ ...collegeForm, website: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Accreditations & Ranking Arrays */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Accreditation */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Accreditation (NMC, NAAC, etc.)</span>
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

              {(!collegeForm.accreditation || collegeForm.accreditation.length === 0) ? (
                <div className="p-3 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                  No accreditations added. Click Add above.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {collegeForm.accreditation.map((acc, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <input
                        type="text"
                        placeholder="Agency (NMC)"
                        value={acc.name || ""}
                        onChange={(e) => handleUpdateAccreditation(index, "name", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Grade (A+)"
                        value={acc.grade || ""}
                        onChange={(e) => handleUpdateAccreditation(index, "grade", e.target.value)}
                        className="w-24 px-2 py-1.5 text-xs border border-slate-200 rounded-lg text-indigo-600 font-bold"
                      />
                      <input
                        type="number"
                        placeholder="Year"
                        value={acc.year ?? ""}
                        onChange={(e) => handleUpdateAccreditation(index, "year", e.target.value ? Number(e.target.value) : "")}
                        className="w-20 px-2 py-1.5 text-xs border border-slate-200 rounded-lg font-mono"
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

            {/* Ranking */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <Star className="w-4 h-4 text-indigo-600" />
                  <span>Rankings (NIRF, QS, India Today)</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddRanking}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer border border-indigo-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {(!collegeForm.ranking || collegeForm.ranking.length === 0) ? (
                <div className="p-3 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                  No rankings registered. Click Add above.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {collegeForm.ranking.map((rnk, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <input
                        type="text"
                        placeholder="Body (NIRF)"
                        value={rnk.organization || ""}
                        onChange={(e) => handleUpdateRanking(index, "organization", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-bold"
                      />
                      <input
                        type="number"
                        placeholder="Rank (#)"
                        value={rnk.rank ?? ""}
                        onChange={(e) => handleUpdateRanking(index, "rank", e.target.value ? Number(e.target.value) : "")}
                        className="w-20 px-2 py-1.5 text-xs border border-slate-200 rounded-lg text-indigo-600 font-bold"
                      />
                      <input
                        type="number"
                        placeholder="Year"
                        value={rnk.year ?? ""}
                        onChange={(e) => handleUpdateRanking(index, "year", e.target.value ? Number(e.target.value) : "")}
                        className="w-20 px-2 py-1.5 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRanking(index)}
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

          {/* SECTION 5: Status, Rating & Verification */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Listing Status:
              </label>
              <select
                value={collegeForm.status || "pending"}
                onChange={(e) => setCollegeForm({ ...collegeForm, status: e.target.value })}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="active">Active (Published)</option>
                <option value="pending">Pending (Review)</option>
                <option value="inactive">Inactive (Archived)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(collegeForm.isVerified)}
                onChange={(e) => setCollegeForm({ ...collegeForm, isVerified: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mark as Officially Verified Institution</span>
              </span>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-xs text-slate-500">
              <span className="text-rose-500">*</span> Mandatory college fields
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
                <span>{submitting ? "Saving..." : editingCollege ? "Update College" : "Register College"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollegeModal;
