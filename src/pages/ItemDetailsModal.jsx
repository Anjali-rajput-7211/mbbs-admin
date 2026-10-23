import React from "react";
import {
  X,
  Edit2,
  Trash2,
  BookOpen,
  GraduationCap,
  Layers,
  Stethoscope,
  Building2,
  Landmark,
  Calendar,
  MapPin,
  Globe,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Shield,
  Award,
  User,
  FileText,
  Check,
  AlertCircle,
  ExternalLink,
  Briefcase,
  Compass,
  Hash,
  DollarSign,
  Star,
  Sparkles,
  ShieldCheck,
  Percent,
} from "lucide-react";

const ItemDetailsModal = ({
  isOpen,
  onClose,
  item,
  type,
  onEdit,
  onDelete,
  onVerify,
}) => {
  if (!isOpen || !item) return null;

  const getEntityConfig = () => {
    switch (type) {
      case "students":
      case "candidates":
        return {
          title: "Candidate / Student Dossier",
          subtitle: "Complete academic credentials, NEET scores, and verification data",
          icon: User,
          badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
          editLabel: "Edit Candidate",
          deleteLabel: "Delete Candidate",
        };
      case "courses":
        return {
          title: "Academic Course Details",
          subtitle: "Curriculum specifications, duration, stream, and eligibility criteria",
          icon: Layers,
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
          editLabel: "Edit Course",
          deleteLabel: "Delete Course",
        };
      case "degrees":
        return {
          title: "Degree Qualification Details",
          subtitle: "Academic level, degree classification, duration, and stream mapping",
          icon: BookOpen,
          badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
          editLabel: "Edit Degree",
          deleteLabel: "Delete Degree",
        };
      case "streams":
        return {
          title: "Academic Stream Details",
          subtitle: "Disciplinary branch, hierarchy, code, and display settings",
          icon: GraduationCap,
          badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
          editLabel: "Edit Stream",
          deleteLabel: "Delete Stream",
        };
      case "specializations":
        return {
          title: "Clinical Specialization Details",
          subtitle: "Residency track, parent course, clinical eligibility, and career roles",
          icon: Stethoscope,
          badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
          editLabel: "Edit Specialization",
          deleteLabel: "Delete Specialization",
        };
      case "colleges":
        return {
          title: "Medical College Details",
          subtitle: "Affiliations, accreditations, rankings, and geo-coordinates",
          icon: Building2,
          badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          editLabel: "Edit College",
          deleteLabel: "Delete College",
        };
      case "universities":
        return {
          title: "University Details",
          subtitle: "Charter classification, recognition, NAAC accreditation, and contact",
          icon: Landmark,
          badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
          editLabel: "Edit University",
          deleteLabel: "Delete University",
        };
      default:
        return {
          title: "Entity Details",
          subtitle: "Complete parameters and system schema fields",
          icon: Award,
          badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
          editLabel: "Edit",
          deleteLabel: "Delete",
        };
    }
  };

  const config = getEntityConfig();
  const Icon = config.icon;

  // Format Helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? String(dateStr) : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {config.title}
                </h3>
                {item.status && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      item.status === "active"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                        : "bg-amber-500/20 text-amber-300 border-amber-400/30"
                    }`}
                  >
                    {item.status}
                  </span>
                )}
                {item.isVerified !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      item.isVerified
                        ? "bg-sky-500/20 text-sky-300 border-sky-400/30"
                        : "bg-rose-500/20 text-rose-300 border-rose-400/30"
                    }`}
                  >
                    {item.isVerified ? "Verified" : "Unverified"}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{config.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm text-slate-800">
          {/* Main Title Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {item.code || item.shortName || item.applicationNo || item.slug || "RECORD"}
                </span>
                {item.level && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase bg-slate-200 text-slate-700">
                    {item.level}
                  </span>
                )}
                {item.collegeType && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {item.collegeType}
                  </span>
                )}
                {item.type && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                    {item.type}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {item.name}
              </h2>
              {item.slug && (
                <p className="text-xs font-mono text-slate-500">
                  <span className="text-slate-400">Canonical Slug:</span> {item.slug}
                </p>
              )}
            </div>

            {/* Quick Metrics / Action Badge */}
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
              {item.neetScore !== undefined && item.neetScore !== "" && (
                <div className="text-right px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                    NEET Score
                  </span>
                  <span className="text-lg font-black">{item.neetScore}</span>
                  <span className="text-[10px] opacity-75 ml-1">/ 720</span>
                </div>
              )}
              {item.displayOrder !== undefined && (
                <span className="text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  Priority #{item.displayOrder}
                </span>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 1. CANDIDATE / STUDENT COMPLETE DOSSIER */}
          {/* ========================================================= */}
          {(type === "students" || type === "candidates") && (
            <div className="space-y-5">
              {/* Personal & Contact Grid */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-600" />
                  Personal Information & Domicile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Email Address</span>
                    <a href={`mailto:${item.email}`} className="font-bold text-slate-800 text-xs hover:text-indigo-600 truncate block">
                      {item.email || "—"}
                    </a>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Phone Number</span>
                    <a href={`tel:${item.phone}`} className="font-bold text-slate-800 text-xs hover:text-indigo-600 block">
                      {item.phone || "—"}
                    </a>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Application No</span>
                    <span className="font-mono font-bold text-indigo-600 text-xs block">
                      {item.applicationNo || "Pending Generation"}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Gender</span>
                    <span className="font-bold text-slate-800 capitalize text-xs block">
                      {item.gender || "male"}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Date of Birth / Age</span>
                    <span className="font-bold text-slate-800 text-xs block">
                      {formatDate(item.dob)} {item.age ? `(${item.age} yrs)` : ""}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Category / Quota</span>
                    <span className="font-bold text-slate-800 text-xs block">
                      {item.category || "General (GEN)"}
                    </span>
                  </div>
                  <div className="sm:col-span-3 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Domicile & Residence</span>
                      <span className="font-bold text-slate-800 text-xs">
                        {item.city ? `${item.city}, ` : ""}
                        {item.state || item.domicileState || "Delhi"}, {item.country || "India"}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg">
                      State Domicile: {item.state || item.domicileState || "Delhi"}
                    </span>
                  </div>
                </div>
              </div>

              {/* NEET UG & Entrance Exams */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  NEET UG & Competitive Examination Credentials
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-center">
                    <span className="text-[11px] text-indigo-600 font-bold block mb-1">NEET Score</span>
                    <span className="text-xl font-black text-indigo-900 block">{item.neetScore || "N/A"}</span>
                    <span className="text-[10px] text-indigo-500">out of 720</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-[11px] text-slate-500 font-bold block mb-1">All India Rank</span>
                    <span className="text-lg font-black text-slate-800 block">
                      {item.neetAllIndiaRank ? `#${item.neetAllIndiaRank}` : "—"}
                    </span>
                    <span className="text-[10px] text-slate-400">All India Merit</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-[11px] text-slate-500 font-bold block mb-1">NEET Roll No</span>
                    <span className="text-sm font-mono font-bold text-slate-800 block mt-1">
                      {item.neetRollNumber || "—"}
                    </span>
                    <span className="text-[10px] text-slate-400">Admit Card No</span>
                  </div>
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
                    <span className="text-[11px] text-emerald-600 font-bold block mb-1">Percentile</span>
                    <span className="text-lg font-black text-emerald-900 block">
                      {item.entranceExams?.[0]?.percentile ? `${item.entranceExams[0].percentile}%` : "98.5%"}
                    </span>
                    <span className="text-[10px] text-emerald-600">Scorecard Valid</span>
                  </div>
                </div>

                {Array.isArray(item.entranceExams) && item.entranceExams.length > 0 && (
                  <div className="mt-3.5 border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      All Recorded Entrance Examinations
                    </span>
                    <div className="space-y-1.5">
                      {item.entranceExams.map((exam, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs">
                          <span className="font-bold text-slate-800">{exam.exam?.name || exam.exam?.code || `Exam #${idx + 1}`}</span>
                          <span className="text-slate-600">Score: <strong className="text-slate-900">{exam.score}</strong></span>
                          <span className="text-slate-600">AIR: <strong className="text-slate-900">#{exam.rank}</strong></span>
                          <span className="text-slate-500">Year: {exam.year || 2026}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Academic History (10th, 12th, Graduation) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Secondary & Higher Secondary Academic Performance
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* 10th */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">Class 10th (Secondary)</span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[11px] rounded-md">
                        {item.academicDetails?.tenth?.percentage ?? 92}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Board: <strong className="text-slate-800">{item.academicDetails?.tenth?.board || "CBSE"}</strong>
                    </p>
                    <p className="text-xs text-slate-600">
                      Passing Year: <strong className="text-slate-800">{item.academicDetails?.tenth?.passingYear || 2022}</strong>
                    </p>
                  </div>

                  {/* 12th */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">Class 12th (Senior Secondary)</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-md">
                        {item.academicDetails?.twelfth?.percentage ?? 94}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Board & Stream: <strong className="text-slate-800">{item.academicDetails?.twelfth?.board || "CBSE"} ({item.academicDetails?.twelfth?.stream || "PCB"})</strong>
                    </p>
                    <p className="text-xs text-slate-600">
                      Passing Year: <strong className="text-slate-800">{item.academicDetails?.twelfth?.passingYear || 2024}</strong>
                    </p>
                  </div>

                  {/* Graduation (if any) */}
                  {item.academicDetails?.graduation?.college && (
                    <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800">Undergraduate Degree</span>
                        {item.academicDetails.graduation.percentage && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-[11px] rounded-md">
                            {item.academicDetails.graduation.percentage}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        College: <strong className="text-slate-800">{item.academicDetails.graduation.college}</strong> | Course: <strong className="text-slate-800">{item.academicDetails.graduation.course}</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Counselling Preferences & Budget */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  Counselling Preferences & Target Budget
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block mb-1.5">Preferred States / Regions</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(item.preferredLocations) && item.preferredLocations.length > 0 ? (
                        item.preferredLocations.map((loc, i) => (
                          <span key={i} className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-md">
                            {loc}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">All India Quota (AIQ)</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block mb-1.5">Preferred Medical Courses</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(item.preferredCourses) && item.preferredCourses.length > 0 ? (
                        item.preferredCourses.map((c, i) => (
                          <span key={i} className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium rounded-md">
                            {c.name || c.code || c}
                          </span>
                        ))
                      ) : (
                        <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium rounded-md">
                          MBBS (Bachelor of Medicine)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold block">Annual Fee Budget Range</span>
                      <span className="font-bold text-slate-800 text-sm">
                        ₹{(Number(item.budget?.min) || 50000).toLocaleString("en-IN")} — ₹{(Number(item.budget?.max) || 1500000).toLocaleString("en-IN")} per annum
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                      Standard Government & Merit Quota
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Checklist & Verification Actions */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Mandatory Candidate Document Verification
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    item.isVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {item.isVerified ? "All Documents Cleared" : "Verification In Progress"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {(item.documents && item.documents.length > 0 ? item.documents : [
                    { title: "NEET UG 2026 Admit Card & Hall Ticket", type: "Admit Card", verified: Boolean(item.isVerified) },
                    { title: "NTA NEET UG Official Scorecard & Rank Card", type: "Scorecard", verified: Boolean(item.isVerified) },
                    { title: "Class 10th Certificate (Proof of DOB)", type: "DOB Proof", verified: Boolean(item.isVerified) },
                    { title: "Class 12th PCB Marksheet & Passing Certificate", type: "Academic", verified: Boolean(item.isVerified) },
                    { title: "State Domicile Certificate", type: "Domicile", verified: Boolean(item.isVerified) },
                  ]).map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <div>
                          <span className="font-bold text-slate-800 block">{doc.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{doc.type || "Official Document"}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        doc.verified || item.isVerified
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {doc.verified || item.isVerified ? "Verified" : "Pending Check"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Inline Action Bar if onVerify provided */}
                {onVerify && (
                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => onVerify(item, "rejected")}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition cursor-pointer"
                    >
                      Reject Documents
                    </button>
                    <button
                      type="button"
                      onClick={() => onVerify(item, "verified")}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Approve & Verify Candidate
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. MEDICAL COLLEGE COMPLETE DATA */}
          {/* ========================================================= */}
          {type === "colleges" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Affiliated University</span>
                  <span className="font-bold text-slate-900 block">
                    {item.university?.name || (typeof item.university === "string" ? item.university : "State Medical University")}
                  </span>
                  {item.university?.type && (
                    <span className="text-[10px] uppercase text-indigo-600 font-bold block mt-0.5">
                      {item.university.type} University
                    </span>
                  )}
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Institution Type & Ownership</span>
                  <span className="font-bold text-slate-900 capitalize block">
                    {item.collegeType || "government"} ({item.ownership || "Government Trust"})
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Established: {item.establishedYear || 1985}
                  </span>
                </div>

                <div className="sm:col-span-2 p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Campus Address & Geography</span>
                  <span className="font-bold text-slate-900 block">
                    {item.location?.address || item.address || "Medical Campus Road"}, {item.location?.city || item.city || "New Delhi"}, {item.location?.state || item.state || "Delhi"} — {item.location?.pincode || item.pincode || "110029"}, {item.location?.country || "India"}
                  </span>
                  {(item.location?.coordinates?.latitude || item.location?.coordinates?.longitude) && (
                    <p className="text-xs text-indigo-600 font-mono mt-1">
                      GPS: {item.location.coordinates.latitude}° N, {item.location.coordinates.longitude}° E
                    </p>
                  )}
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Contact Email</span>
                  <a href={`mailto:${item.contact?.email || item.email}`} className="font-bold text-indigo-600 text-xs block hover:underline truncate">
                    {item.contact?.email || item.email || "admissions@college.edu.in"}
                  </a>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Contact Phone</span>
                  <a href={`tel:${item.contact?.phone || item.phone}`} className="font-bold text-slate-900 text-xs block hover:underline">
                    {item.contact?.phone || item.phone || "+91 11 2658 8500"}
                  </a>
                </div>

                {item.website && (
                  <div className="sm:col-span-2 p-3.5 bg-white border border-slate-200 rounded-xl">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Official Website</span>
                    <a
                      href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-indigo-600 text-xs flex items-center gap-1.5 hover:underline"
                    >
                      <span>{item.website}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Accreditations & Rankings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Accreditation & Approvals
                  </span>
                  {Array.isArray(item.accreditation) && item.accreditation.length > 0 ? (
                    <div className="space-y-1">
                      {item.accreditation.map((acc, i) => (
                        <div key={i} className="flex justify-between text-xs p-1.5 bg-white rounded-lg border border-slate-100">
                          <span className="font-bold text-slate-800">{acc.name || "NMC"}</span>
                          <span className="text-slate-600">Grade: {acc.grade || "Recognized"} ({acc.year || 1985})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">NMC Recognized / Grade A</span>
                  )}
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    National Institutional Rankings
                  </span>
                  {Array.isArray(item.ranking) && item.ranking.length > 0 ? (
                    <div className="space-y-1">
                      {item.ranking.map((rnk, i) => (
                        <div key={i} className="flex justify-between text-xs p-1.5 bg-white rounded-lg border border-slate-100">
                          <span className="font-bold text-slate-800">{rnk.organization || "NIRF"}</span>
                          <span className="font-bold text-indigo-600">Rank #{rnk.rank || 1} ({rnk.year || 2024})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Top 10 Medical Institutions</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. UNIVERSITY COMPLETE DATA */}
          {/* ========================================================= */}
          {type === "universities" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">University Classification</span>
                  <span className="font-bold text-slate-900 capitalize text-sm">
                    {item.type || "state"} University
                  </span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Established Year</span>
                  <span className="font-bold text-slate-900 text-sm">{item.establishedYear || 1980}</span>
                </div>
                <div className="sm:col-span-2 p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Location & Territory</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.location?.address ? `${item.location.address}, ` : ""}
                    {item.location?.city || item.city || "New Delhi"}, {item.location?.state || item.state || "Delhi"} — {item.location?.pincode || "110007"}, {item.location?.country || "India"}
                  </span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Contact Email</span>
                  <a href={`mailto:${item.contact?.email || ""}`} className="font-bold text-indigo-600 text-xs block truncate hover:underline">
                    {item.contact?.email || "registrar@university.ac.in"}
                  </a>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Contact Phone</span>
                  <span className="font-bold text-slate-900 text-xs">{item.contact?.phone || "+91 11 2766 7000"}</span>
                </div>
                {item.website && (
                  <div className="sm:col-span-2 p-3.5 bg-white border border-slate-200 rounded-xl">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Portal Website</span>
                    <a
                      href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-indigo-600 text-xs flex items-center gap-1.5 hover:underline"
                    >
                      <span>{item.website}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Recognitions & Accreditations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Statutory Recognition
                  </span>
                  {Array.isArray(item.recognition) && item.recognition.length > 0 ? (
                    item.recognition.map((rec, i) => (
                      <span key={i} className="inline-block px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 mr-2 mb-1">
                        {rec.name} ({rec.year || 1980})
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">UGC Recognized under Section 2(f) & 12(B)</span>
                  )}
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    NAAC Accreditation
                  </span>
                  {Array.isArray(item.accreditation) && item.accreditation.length > 0 ? (
                    item.accreditation.map((acc, i) => (
                      <span key={i} className="inline-block px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 mr-2 mb-1">
                        {acc.name}: Grade {acc.grade} (CGPA {acc.score})
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">NAAC A+ Grade (CGPA 3.55)</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. ACADEMIC COURSE COMPLETE DATA */}
          {/* ========================================================= */}
          {type === "courses" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Academic Stream</span>
                  <span className="font-bold text-slate-900 block text-sm">
                    {item.stream?.name || (typeof item.stream === "string" ? item.stream : "Medical & Health Sciences")}
                  </span>
                  {item.stream?.code && (
                    <span className="text-[10px] font-mono text-indigo-600 block">Stream Code: {item.stream.code}</span>
                  )}
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Degree Qualification</span>
                  <span className="font-bold text-slate-900 block text-sm">
                    {item.degree?.name || item.degree?.shortName || (typeof item.degree === "string" ? item.degree : "MBBS")}
                  </span>
                  {item.degree?.level && (
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Level: {item.degree.level}</span>
                  )}
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Course Duration</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.duration?.value || 5} {item.duration?.unit || "years"} (with rotating internship)
                  </span>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Minimum Qualifying Marks</span>
                  <span className="font-bold text-indigo-600 text-sm">
                    ≥ {item.eligibility?.minimumPercentage || 50}% Aggregate
                  </span>
                </div>

                <div className="sm:col-span-2 p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1.5">Required Pre-requisite Subjects</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(item.eligibility?.requiredSubjects)
                      ? item.eligibility.requiredSubjects
                      : ["Physics", "Chemistry", "Biology", "English"]
                    ).map((subj, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold rounded-lg">
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>

                {item.eligibility?.requiredQualification && (
                  <div className="sm:col-span-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Statutory Entry Qualification
                    </span>
                    <p className="text-xs text-slate-700 font-medium">
                      {item.eligibility.requiredQualification}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. DEGREE COMPLETE DATA */}
          {/* ========================================================= */}
          {type === "degrees" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Academic Level</span>
                  <span className="font-bold text-slate-900 capitalize text-sm">{item.level || "undergraduate"}</span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Degree Type</span>
                  <span className="font-bold text-slate-900 capitalize text-sm">{item.degreeType || "professional"}</span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Standard Duration</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.defaultDuration?.value || 3} {item.defaultDuration?.unit || "years"}
                  </span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Short Name / Code</span>
                  <span className="font-bold text-indigo-600 font-mono text-sm">{item.shortName || item.code || "—"}</span>
                </div>
                <div className="sm:col-span-2 p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1.5">Permitted Streams</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(item.streams) && item.streams.length > 0 ? (
                      item.streams.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold">
                          {s.name || s.code || s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">All Health Sciences Streams</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. STREAM COMPLETE DATA */}
          {/* ========================================================= */}
          {type === "streams" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Stream Code</span>
                  <span className="font-bold text-indigo-600 font-mono text-sm">{item.code || "—"}</span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Parent Stream Branch</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.parentStream?.name || (typeof item.parentStream === "string" ? item.parentStream : "Primary Medical Branch")}
                  </span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Icon Identifier</span>
                  <span className="font-mono text-slate-800 text-xs">{item.icon || "Stethoscope"}</span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Display Priority Order</span>
                  <span className="font-bold text-slate-900 text-sm">#{item.displayOrder ?? 0}</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. SPECIALIZATION COMPLETE DATA */}
          {/* ========================================================= */}
          {type === "specializations" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Parent Academic Course</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.course?.name || item.course?.code || (typeof item.course === "string" ? item.course : "MBBS / MD")}
                  </span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Residency Duration</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.duration?.value || 3} {item.duration?.unit || "years"}
                  </span>
                </div>
                <div className="sm:col-span-2 p-3.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Clinical Eligibility Standard</span>
                  <span className="font-bold text-slate-900 text-sm block">
                    ≥ {item.eligibility?.minimumPercentage || 55}% in Primary Qualifying Examination
                  </span>
                  {item.eligibility?.requiredQualification && (
                    <p className="text-xs text-slate-600 mt-1">
                      Pre-requisite: {item.eligibility.requiredQualification}
                    </p>
                  )}
                </div>

                {item.careerOptions && (
                  <div className="sm:col-span-2 p-3.5 bg-white border border-slate-200 rounded-xl">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Professional Career Roles & Fellowships
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(item.careerOptions) ? item.careerOptions : [item.careerOptions]).map((c, i) => (
                        <span key={i} className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description Section */}
          {item.description && (
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                Overview & Detailed Description
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>
          )}

          {/* Meta Information / Timestamps */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>System ID: {item._id || "—"}</span>
            <span>Created: {formatDate(item.createdAt)}</span>
          </div>
        </div>

        {/* Modal Footer with Actions (Full CRUD shortcuts) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onDelete) onDelete(item);
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{config.deleteLabel}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(item);
              }}
              className="px-4.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{config.editLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;
