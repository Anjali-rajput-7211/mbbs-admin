import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Check,
  Award,
  BookOpen,
  GraduationCap,
  Sparkles,
  HelpCircle
} from "lucide-react";

const API = "http://localhost:5000";

const StudentVerificationModal = ({ student, onClose, onRefresh }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("documents"); // 'documents' | 'academic' | 'eligibility'

  // Document action state
  const [rejectingDocId, setRejectingDocId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Eligibility evaluation state
  const [eligibilityData, setEligibilityData] = useState(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch full student profile
  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      // Fetch either by StudentProfile ID or user ID
      const res = await axios.get(`${API}/api/admin/students`, {
        ...getHeaders(),
        params: { search: student.email || student.name },
      });

      if (res.data.success && res.data.data.length > 0) {
        setProfileData(res.data.data[0]);
      } else {
        // Fallback default structure
        setProfileData({
          user: student,
          applicationNo: `MCC-2025-${Math.floor(100000 + Math.random() * 900000)}`,
          category: "General",
          domicileState: "Delhi",
          entranceExam: { score: 645, airRank: 3840, percentile: 98.4 },
          academicDetails: {
            class10: { board: "CBSE", percentage: 89 },
            class12: { board: "CBSE", pcbPercentage: 86 },
          },
          documents: [
            { id: "doc-1", title: "NEET UG 2025 Admit Card", documentType: "Admit Card", status: "pending" },
            { id: "doc-2", title: "NEET UG Scorecard", documentType: "Scorecard", status: "pending" },
            { id: "doc-4", title: "Class 10th Certificate", documentType: "DOB Proof", status: "pending" },
            { id: "doc-5", title: "Class 12th PCB Marksheet", documentType: "Academic", status: "pending" },
            { id: "doc-6", title: "State Domicile Certificate", documentType: "Domicile", status: "pending" },
          ],
        });
      }
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (student) {
      fetchStudentProfile();
    }
  }, [student]);

  // Handle Verify/Reject Document
  const handleVerifyDoc = async (docId, status, reason = "") => {
    if (!profileData?._id) return;

    try {
      setActionLoading(true);
      const res = await axios.patch(
        `${API}/api/admin/students/${profileData._id}/verify-document`,
        { docId, status, rejectionReason: reason },
        getHeaders()
      );

      if (res.data.success) {
        setProfileData(res.data.data);
        setRejectingDocId(null);
        setRejectionReason("");
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update document verification status");
    } finally {
      setActionLoading(false);
    }
  };

  // Evaluate Eligibility Check
  const evaluateEligibility = async () => {
    if (!profileData?._id) return;
    try {
      setEligibilityLoading(true);
      const res = await axios.get(
        `${API}/api/admin/students/${profileData._id}/eligibility`,
        getHeaders()
      );
      if (res.data.success) {
        setEligibilityData(res.data);
      }
    } catch (err) {
      console.error("Eligibility check error:", err);
    } finally {
      setEligibilityLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center text-sm shadow-md">
              {student.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{student.name || "Candidate"}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-sky-300 font-bold">
                  {profileData?.applicationNo || "MCC-2025-APP"}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">{student.email} • {student.phone || "N/A"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab("documents")}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeSubTab === "documents"
                ? "border-sky-600 text-sky-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Verification Documents ({profileData?.documents?.length || 0})
          </button>
          <button
            onClick={() => setActiveSubTab("academic")}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeSubTab === "academic"
                ? "border-sky-600 text-sky-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Academic & NEET Scores
          </button>
          <button
            onClick={() => {
              setActiveSubTab("eligibility");
              if (!eligibilityData) evaluateEligibility();
            }}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeSubTab === "eligibility"
                ? "border-sky-600 text-sky-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Eligibility Rule Evaluation
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Loading student admissions dossier...
            </div>
          ) : (
            <>
              {/* SUBTAB 1: DOCUMENTS VERIFICATION */}
              {activeSubTab === "documents" && (
                <div className="space-y-3">
                  <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-900 flex items-center justify-between">
                    <span>
                      Review and approve student credentials. Every rejection requires an official reason.
                    </span>
                    <span className="font-bold text-sky-700 uppercase text-[10px]">
                      Status: {profileData?.applicationStatus || "under_review"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {profileData?.documents?.map((doc) => (
                      <div
                        key={doc.id || doc._id}
                        className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{doc.title}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                doc.status === "approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : doc.status === "rejected"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {doc.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Category: {doc.documentType}
                          </p>
                          {doc.rejectionReason && (
                            <p className="text-[11px] text-rose-600 mt-1 font-semibold">
                              Rejection Note: {doc.rejectionReason}
                            </p>
                          )}
                        </div>

                        {/* Verification Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleVerifyDoc(doc.id, "approved")}
                            disabled={actionLoading || doc.status === "approved"}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => setRejectingDocId(doc.id)}
                            disabled={actionLoading || doc.status === "rejected"}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 disabled:opacity-40 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reject Reason Modal / Input */}
                  {rejectingDocId && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 animate-fade-in">
                      <p className="text-xs font-bold text-rose-900">
                        Specify Rejection Reason (Mandatory):
                      </p>
                      <input
                        type="text"
                        placeholder="e.g. Blurred certificate scan / signature missing / invalid board"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs text-slate-800 outline-none focus:ring-1 focus:ring-rose-500 font-medium"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setRejectingDocId(null)}
                          className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleVerifyDoc(rejectingDocId, "rejected", rejectionReason)}
                          disabled={!rejectionReason.trim()}
                          className="px-4 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 2: ACADEMIC & NEET SCORES */}
              {activeSubTab === "academic" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">NEET All India Rank</span>
                      <span className="text-base font-black text-sky-600">
                        #{profileData?.entranceExam?.airRank || "3840"}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">NEET Marks</span>
                      <span className="text-base font-bold text-slate-800">
                        {profileData?.entranceExam?.score || 645} / 720
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">NEET Percentile</span>
                      <span className="text-base font-bold text-slate-800">
                        {profileData?.entranceExam?.percentile || 98.4}%
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">Category</span>
                      <span className="text-base font-bold text-slate-800">
                        {profileData?.category || "General"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                      Academic Qualification Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-500 block">Class 10th (Secondary)</span>
                        <p className="font-bold text-slate-800">
                          {profileData?.academicDetails?.class10?.board || "CBSE"} —{" "}
                          {profileData?.academicDetails?.class10?.percentage || 88}%
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Class 12th (Physics, Chemistry, Biology)</span>
                        <p className="font-bold text-emerald-600">
                          PCB Aggregate: {profileData?.academicDetails?.class12?.pcbPercentage || 84}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: ELIGIBILITY EVALUATION */}
              {activeSubTab === "eligibility" && (
                <div className="space-y-4 text-xs">
                  {eligibilityLoading ? (
                    <div className="py-8 text-center text-slate-500">
                      Evaluating counselling eligibility benchmarks...
                    </div>
                  ) : eligibilityData ? (
                    <div className="space-y-3">
                      <div
                        className={`p-4 rounded-2xl border flex items-center justify-between ${
                          eligibilityData.isFullyEligible
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-amber-50 border-amber-200 text-amber-900"
                        }`}
                      >
                        <div>
                          <p className="font-black text-sm">
                            {eligibilityData.isFullyEligible
                              ? "Eligible for Seat Allotment"
                              : "Eligibility Pending / Action Required"}
                          </p>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            Evaluated against Medical Council of India & MCC Admission Criteria
                          </p>
                        </div>
                        <span className="text-2xl">
                          {eligibilityData.isFullyEligible ? "✅" : "⚠️"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {eligibilityData.checks?.map((chk, i) => (
                          <div
                            key={i}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-bold text-slate-800">{chk.criteria}</p>
                              <p className="text-[11px] text-slate-500">
                                Required: {chk.required} • Actual: {chk.actual}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                chk.passed
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {chk.passed ? "PASSED" : "FAILED"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={evaluateEligibility}
                      className="px-4 py-2 bg-sky-600 text-white rounded-xl font-bold"
                    >
                      Run Automated Eligibility Test
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentVerificationModal;
