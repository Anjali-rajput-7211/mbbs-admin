import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  DollarSign,
  BookOpen,
  Lock,
  X,
  CheckCircle2,
  Building,
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

export const CATEGORIES = ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD"];

export const INITIAL_STUDENT_FORM = {
  name: "",
  email: "",
  password: "Password@123",
  phone: "",
  dob: "2006-05-15",
  gender: "male",
  city: "New Delhi",
  state: "Delhi",
  country: "India",
  category: "General",
  academicDetails: {
    tenth: {
      board: "CBSE",
      percentage: 92,
      passingYear: 2022,
    },
    twelfth: {
      board: "CBSE",
      percentage: 94,
      passingYear: 2024,
      stream: "PCB (Physics, Chemistry, Biology)",
    },
    graduation: {
      college: "",
      course: "",
      percentage: null,
      passingYear: null,
    },
  },
  entranceExams: [
    {
      score: 650,
      percentile: 99.4,
      rank: 4200,
      year: 2026,
    },
  ],
  preferredLocations: ["Delhi", "Maharashtra", "Karnataka"],
  preferredCourses: [],
  budget: {
    min: 50000,
    max: 1500000,
  },
  isVerified: false,
};

const StudentModal = ({
  isOpen,
  onClose,
  onSubmit,
  studentForm,
  setStudentForm,
  editingStudent,
  submitting = false,
}) => {
  if (!isOpen) return null;

  // Safe accessor helpers
  const academic = studentForm.academicDetails || {};
  const tenth = academic.tenth || {};
  const twelfth = academic.twelfth || {};
  const grad = academic.graduation || {};
  const entrance = (studentForm.entranceExams && studentForm.entranceExams[0]) || {};
  const budget = studentForm.budget || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {editingStudent ? "Edit Student Profile" : "Register Student Candidate"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  StudentProfile Schema
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                NEET UG candidate identity, 10th/12th academic history & preferences
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

        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-sm text-slate-800">
          {/* SECTION 1: Personal & User Identity */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <User className="w-4 h-4 text-indigo-600" />
              <span>1. Candidate User Identity & Demographics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Legal Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Sharma"
                  value={studentForm.name || ""}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="aryan.sharma@example.com"
                  value={studentForm.email || ""}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone Number <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={studentForm.phone || ""}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date of Birth (DOB)</span>
                </label>
                <input
                  type="date"
                  value={studentForm.dob ? String(studentForm.dob).slice(0, 10) : ""}
                  onChange={(e) => setStudentForm({ ...studentForm, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  value={studentForm.gender || "male"}
                  onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={studentForm.category || "General"}
                  onChange={(e) => setStudentForm({ ...studentForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {!editingStudent && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Default: Password@123"
                    value={studentForm.password || ""}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              )}
            </div>

            {/* Location: City, State, Country */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi"
                  value={studentForm.city || ""}
                  onChange={(e) => setStudentForm({ ...studentForm, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>State / Domicile</span>
                </label>
                <select
                  value={studentForm.state || studentForm.domicileState || "Delhi"}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      state: e.target.value,
                      domicileState: e.target.value,
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
                  Country
                </label>
                <input
                  type="text"
                  value={studentForm.country || "India"}
                  onChange={(e) => setStudentForm({ ...studentForm, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Academic Details (Tenth, Twelfth, Graduation) */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>2. Academic Details (10th, 12th & Higher Education)</span>
            </div>

            {/* 10th Standard Details */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-2">
              <div className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-bold">10</span>
                <span>Secondary School (10th Standard)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Board / Council</label>
                  <input
                    type="text"
                    placeholder="e.g. CBSE / ICSE / State Board"
                    value={tenth.board || ""}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        academicDetails: {
                          ...academic,
                          tenth: { ...tenth, board: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Percentage (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="92.5"
                    value={tenth.percentage ?? ""}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        academicDetails: {
                          ...academic,
                          tenth: { ...tenth, percentage: e.target.value ? Number(e.target.value) : null },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-bold text-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Passing Year</label>
                  <input
                    type="number"
                    placeholder="2022"
                    value={tenth.passingYear ?? ""}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        academicDetails: {
                          ...academic,
                          tenth: { ...tenth, passingYear: e.target.value ? Number(e.target.value) : null },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 12th Standard Details */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-2">
              <div className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-bold">12</span>
                <span>Senior Secondary (12th Standard - PCB / Science)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Board / Council</label>
                  <input
                    type="text"
                    placeholder="CBSE / State Board"
                    value={twelfth.board || ""}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        academicDetails: {
                          ...academic,
                          twelfth: { ...twelfth, board: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Stream / Subjects</label>
                  <input
                    type="text"
                    placeholder="e.g. PCB / Science"
                    value={twelfth.stream || ""}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        academicDetails: {
                          ...academic,
                          twelfth: { ...twelfth, stream: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Percentage (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="94.0"
                    value={twelfth.percentage ?? ""}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        academicDetails: {
                          ...academic,
                          twelfth: { ...twelfth, percentage: e.target.value ? Number(e.target.value) : null },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-bold text-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Passing Year</label>
                  <input
                    type="number"
                    placeholder="2024"
                    value={twelfth.passingYear ?? ""}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        academicDetails: {
                          ...academic,
                          twelfth: { ...twelfth, passingYear: e.target.value ? Number(e.target.value) : null },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Graduation Details (Optional) */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-2">
              <div className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-[11px] font-bold">UG</span>
                  <span>Graduation / Previous Degree (Optional for PG Counselling)</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">College / Institute</label>
                  <input
                    type="text"
                    placeholder="e.g. Maulana Azad Medical College"
                    value={grad.college || ""}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        academicDetails: {
                          ...academic,
                          graduation: { ...grad, college: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Course / Degree</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS / B.Sc"
                    value={grad.course || ""}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        academicDetails: {
                          ...academic,
                          graduation: { ...grad, course: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Percentage / Year</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="%"
                      value={grad.percentage ?? ""}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          academicDetails: {
                            ...academic,
                            graduation: { ...grad, percentage: e.target.value ? Number(e.target.value) : null },
                          },
                        })
                      }
                      className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-bold"
                    />
                    <input
                      type="number"
                      placeholder="Year"
                      value={grad.passingYear ?? ""}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          academicDetails: {
                            ...academic,
                            graduation: { ...grad, passingYear: e.target.value ? Number(e.target.value) : null },
                          },
                        })
                      }
                      className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Entrance Exam Merit (entranceExams) */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>3. Entrance Examination Performance (NEET UG / Merit)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  NEET Score (/ 720) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="720"
                  placeholder="650"
                  value={entrance.score ?? studentForm.neetScore ?? ""}
                  onChange={(e) => {
                    const score = e.target.value ? Number(e.target.value) : 0;
                    const exams = [...(studentForm.entranceExams || [{}])];
                    exams[0] = { ...exams[0], score };
                    setStudentForm({ ...studentForm, neetScore: score, entranceExams: exams });
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-indigo-600 font-bold text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  All India Rank (AIR) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="4200"
                  value={entrance.rank ?? studentForm.neetAllIndiaRank ?? ""}
                  onChange={(e) => {
                    const rank = e.target.value ? Number(e.target.value) : 0;
                    const exams = [...(studentForm.entranceExams || [{}])];
                    exams[0] = { ...exams[0], rank };
                    setStudentForm({ ...studentForm, neetAllIndiaRank: rank, entranceExams: exams });
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Percentile
                </label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  max="100"
                  placeholder="99.4201"
                  value={entrance.percentile ?? 99.4}
                  onChange={(e) => {
                    const percentile = e.target.value ? Number(e.target.value) : 0;
                    const exams = [...(studentForm.entranceExams || [{}])];
                    exams[0] = { ...exams[0], percentile };
                    setStudentForm({ ...studentForm, percentile, entranceExams: exams });
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Examination Year
                </label>
                <input
                  type="number"
                  placeholder="2026"
                  value={entrance.year ?? 2026}
                  onChange={(e) => {
                    const year = e.target.value ? Number(e.target.value) : 2026;
                    const exams = [...(studentForm.entranceExams || [{}])];
                    exams[0] = { ...exams[0], year };
                    setStudentForm({ ...studentForm, entranceExams: exams });
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Preferences & Budget */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              <span>4. Counselling Preferences & Budget Allocation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred State Locations (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delhi, Maharashtra, Karnataka"
                  value={Array.isArray(studentForm.preferredLocations) ? studentForm.preferredLocations.join(", ") : ""}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      preferredLocations: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Candidates will be matched with college quotas located in these states.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Annual Budget Range (INR ₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Min (₹)</label>
                    <input
                      type="number"
                      step="5000"
                      placeholder="50,000"
                      value={budget.min ?? ""}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          budget: { ...budget, min: e.target.value ? Number(e.target.value) : 0 },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Max (₹)</label>
                    <input
                      type="number"
                      step="5000"
                      placeholder="1,500,000"
                      value={budget.max ?? ""}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          budget: { ...budget, max: e.target.value ? Number(e.target.value) : 0 },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-indigo-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-xs text-slate-500">
              <span className="text-rose-500">*</span> Mandatory candidate fields
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
                <span>{submitting ? "Saving..." : editingStudent ? "Update Student Profile" : "Register Student"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
