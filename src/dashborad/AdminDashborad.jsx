import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Award,
  GraduationCap,
  BookOpen,
  Layers,
  Stethoscope,
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Eye,
  Check,
  TrendingUp,
  FileCheck,
  Table,
  Grid,
  Filter,
  UserCheck,
  UserX,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  AlertTriangle,
  Landmark,
} from "lucide-react";
import Sidebar from "../pages/Sidebar";
import UniversityModal, { INITIAL_UNIVERSITY_FORM } from "../pages/UniversityModal";
import CollegeModal, { INITIAL_COLLEGE_FORM } from "../pages/CollegeModal";
import StreamModal, { INITIAL_STREAM_FORM } from "../pages/StreamModal";
import DegreeModal, { INITIAL_DEGREE_FORM } from "../pages/DegreeModal";
import CourseModal, { INITIAL_COURSE_FORM } from "../pages/CourseModal";
import SpecializationModal, { INITIAL_SPECIALIZATION_FORM } from "../pages/SpecializationModal";
import StudentModal, { INITIAL_STUDENT_FORM } from "../pages/StudentModal";
import EmailTemplatesTab from "../pages/EmailTemplatesTab";
import RolesTab from "../pages/RolesTab";
import ApplicationsTab from "../pages/ApplicationsTab";
import ItemDetailsModal from "../pages/ItemDetailsModal";

const API = "http://localhost:5000";

const AdminDashborad = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [templatesCount, setTemplatesCount] = useState(0);

  // Read logged-in admin and permissions from storage
  const loggedInAdmin = JSON.parse(localStorage.getItem("admin") || "{}");
  const isSuperAdmin = loggedInAdmin.role === "superAdmin";

  // Reusable frontend permission check (Requirements 13 & 14)
  const hasPermission = (permissionId) => {
    if (isSuperAdmin) return true;
    if (!permissionId) return true;
    const userPerms = Array.isArray(loggedInAdmin.permissions) ? loggedInAdmin.permissions : [];
    const aliases = [permissionId];
    if (permissionId.startsWith("create_")) aliases.push(permissionId.replace("create_", "add_"));
    if (permissionId.startsWith("add_")) aliases.push(permissionId.replace("add_", "create_"));
    if (permissionId.startsWith("view_")) aliases.push(permissionId.replace("view_", "manage_"));
    return aliases.some((p) => userPerms.includes(p));
  };

  // Route & Tab protection: redirect to overview if permission missing (Requirement 23)
  useEffect(() => {
    const permMap = {
      applications: "view_applications",
      students: "view_students",
      universities: "view_universities",
      colleges: "view_colleges",
      degrees: "view_degrees",
      streams: "view_streams",
      specializations: "view_specializations",
      "email-templates": "view_email_templates",
      roles: "view_roles",
      admins: "view_roles",
    };
    if (permMap[activeTab] && !hasPermission(permMap[activeTab])) {
      setActiveTab("overview");
    }
  }, [activeTab]);

  // View Mode Toggles
  const [studentViewMode, setStudentViewMode] = useState("table");
  const [collegeViewMode, setCollegeViewMode] = useState("card");

  // Notification Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // State
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalColleges: 0,
    totalCourses: 0,
    verifiedApplications: 0,
    pendingApplications: 0,
    activeRounds: 1,
  });

  // Students State
  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentForm, setStudentForm] = useState(INITIAL_STUDENT_FORM);


  // Universities State
  const [universities, setUniversities] = useState([]);
  const [universityLoading, setUniversityLoading] = useState(false);
  const [universitySearch, setUniversitySearch] = useState("");
  const [universityTypeFilter, setUniversityTypeFilter] = useState("all");
  const [universityViewMode, setUniversityViewMode] = useState("card");
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [showAddUniversityModal, setShowAddUniversityModal] = useState(false);
  const [universityForm, setUniversityForm] = useState(INITIAL_UNIVERSITY_FORM);

  // Colleges State
  const [colleges, setColleges] = useState([]);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [collegeTypeFilter, setCollegeTypeFilter] = useState("all");
  const [collegeUniversityFilter, setCollegeUniversityFilter] = useState("all");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [editingCollege, setEditingCollege] = useState(null);
  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [collegeForm, setCollegeForm] = useState(INITIAL_COLLEGE_FORM);

  // Academic Catalog (Streams, Degrees, Courses, Specializations)
  const [catalogItems, setCatalogItems] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [coursesSubTab, setCoursesSubTab] = useState("courses");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogStreamFilter, setCatalogStreamFilter] = useState("all");
  const [catalogDegreeFilter, setCatalogDegreeFilter] = useState("all");
  const [catalogCourseFilter, setCatalogCourseFilter] = useState("all");

  // Schema-Compliant Modal States
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [editingStream, setEditingStream] = useState(null);
  const [streamForm, setStreamForm] = useState(INITIAL_STREAM_FORM);
  const [allStreams, setAllStreams] = useState([]);

  const [showDegreeModal, setShowDegreeModal] = useState(false);
  const [editingDegree, setEditingDegree] = useState(null);
  const [degreeForm, setDegreeForm] = useState(INITIAL_DEGREE_FORM);
  const [allDegrees, setAllDegrees] = useState([]);

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState(INITIAL_COURSE_FORM);
  const [allCourses, setAllCourses] = useState([]);

  const [showSpecializationModal, setShowSpecializationModal] = useState(false);
  const [editingSpecialization, setEditingSpecialization] = useState(null);
  const [specializationForm, setSpecializationForm] = useState(INITIAL_SPECIALIZATION_FORM);
  const [allSpecializations, setAllSpecializations] = useState([]);

  // Generic Card Inspect Details Modal State (Read operation)
  const [viewingItem, setViewingItem] = useState(null);

  // Delete Confirmation Dialog
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Fetch Handlers
  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/dashboard`, getAuthHeaders());
      if (res.data.success) {
        setStats(res.data.stats || {});
        if (res.data.stats?.totalEmailTemplates !== undefined) {
          setTemplatesCount(res.data.stats.totalEmailTemplates);
        }
      }
    } catch {
      try {
        const [stRes, colRes, uniRes, crRes] = await Promise.all([
          axios.get(`${API}/getAllStudent`, getAuthHeaders()),
          axios.get(`${API}/getAllColleges`, getAuthHeaders()),
          axios.get(`${API}/getAllUniversities`, getAuthHeaders()),
          axios.get(`${API}/getAllCourses`, getAuthHeaders()),
        ]);
        const sList = stRes.data?.data || [];
        const cList = colRes.data?.data || [];
        const uList = uniRes.data?.data || [];
        const crList = crRes.data?.data || [];
        setStats({
          totalStudents: sList.length,
          totalColleges: cList.length,
          totalUniversities: uList.length,
          totalCourses: crList.length,
          verifiedApplications: sList.filter((s) => s.isVerified).length,
          pendingApplications: sList.filter((s) => !s.isVerified).length,
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const fetchStudents = async () => {
    try {
      setStudentLoading(true);
      const res = await axios.get(`${API}/getAllStudent`, getAuthHeaders());
      if (res.data.success) setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setStudentLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      setUniversityLoading(true);
      const res = await axios.get(`${API}/getAllUniversities`, getAuthHeaders());
      if (res.data.success) setUniversities(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setUniversityLoading(false);
    }
  };

  const fetchColleges = async () => {
    try {
      setCollegeLoading(true);
      const res = await axios.get(`${API}/getAllColleges`, getAuthHeaders());
      if (res.data.success) setColleges(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCollegeLoading(false);
    }
  };

  const fetchCatalog = async (type) => {
    try {
      setCatalogLoading(true);
      let endpoint = "/getAllStreams";
      if (type === "degrees") endpoint = "/getAllDegrees";
      if (type === "courses") endpoint = "/getAllCourses";
      if (type === "specializations") endpoint = "/getAllSpecializations";

      const res = await axios.get(`${API}${endpoint}`, getAuthHeaders());
      if (res.data.success) {
        const data = res.data.data || [];
        setCatalogItems(data);
        if (type === "streams") setAllStreams(data);
        if (type === "degrees") setAllDegrees(data);
        if (type === "courses") setAllCourses(data);
        if (type === "specializations") setAllSpecializations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCatalogLoading(false);
    }
  };

  const preloadCatalogReferences = async () => {
    try {
      const [stRes, degRes, crRes, spRes] = await Promise.all([
        axios.get(`${API}/getAllStreams`, getAuthHeaders()),
        axios.get(`${API}/getAllDegrees`, getAuthHeaders()),
        axios.get(`${API}/getAllCourses`, getAuthHeaders()),
        axios.get(`${API}/getAllSpecializations`, getAuthHeaders()),
      ]);
      if (stRes.data?.success) setAllStreams(stRes.data.data || []);
      if (degRes.data?.success) setAllDegrees(degRes.data.data || []);
      if (crRes.data?.success) setAllCourses(crRes.data.data || []);
      if (spRes.data?.success) setAllSpecializations(spRes.data.data || []);
    } catch (err) {
      console.warn("preload references error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchStudents();
    fetchColleges();
    fetchUniversities();
    preloadCatalogReferences();
  }, []);

  useEffect(() => {
    if (activeTab === "students") {
      fetchStudents();
    }
    if (activeTab === "universities") {
      fetchUniversities();
    }
    if (activeTab === "colleges") {
      fetchColleges();
      fetchUniversities();
    }
    if (["streams", "degrees", "courses", "specializations"].includes(activeTab)) {
      fetchCatalog(activeTab);
      preloadCatalogReferences();
    }
  }, [activeTab]);

  // --- CANDIDATE CRUD ---
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        const res = await axios.put(`${API}/updateStudent/${editingStudent._id}`, studentForm, getAuthHeaders());
        if (res.data.success) {
          showToast("Candidate updated successfully!", "success");
          setEditingStudent(null);
          setShowAddStudentModal(false);
          fetchStudents();
          fetchDashboardStats();
        }
      } else {
        const res = await axios.post(`${API}/addStudent`, studentForm, getAuthHeaders());
        if (res.data.success) {
          showToast("Candidate registered successfully!", "success");
          setShowAddStudentModal(false);
          fetchStudents();
          fetchDashboardStats();
        }
      }
      setStudentForm(INITIAL_STUDENT_FORM);
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleOpenEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name || "",
      email: student.email || "",
      password: "",
      phone: student.phone || "",
      dob: student.dob ? String(student.dob).slice(0, 10) : "2006-05-15",
      gender: student.gender || "male",
      city: student.city || "",
      state: student.state || student.domicileState || "Delhi",
      country: student.country || "India",
      category: student.category || "General",
      academicDetails: student.academicDetails || {
        tenth: { board: "CBSE", percentage: 92, passingYear: 2022 },
        twelfth: { board: "CBSE", percentage: 94, passingYear: 2024, stream: "PCB" },
        graduation: { college: "", course: "", percentage: null, passingYear: null },
      },
      entranceExams: Array.isArray(student.entranceExams) && student.entranceExams.length > 0
        ? student.entranceExams
        : [{ score: student.neetScore ?? 650, percentile: 99.4, rank: student.neetAllIndiaRank ?? 4200, year: 2026 }],
      preferredLocations: Array.isArray(student.preferredLocations) && student.preferredLocations.length > 0
        ? student.preferredLocations
        : [student.state || student.domicileState || "Delhi"],
      preferredCourses: student.preferredCourses || [],
      budget: student.budget || { min: 50000, max: 1500000 },
      neetScore: student.neetScore ?? 650,
      neetAllIndiaRank: student.neetAllIndiaRank ?? 4200,
      isVerified: Boolean(student.isVerified),
    });
    setShowAddStudentModal(true);
  };

  const handleDeleteStudent = (student) => {
    setDeleteDialog({
      isOpen: true,
      title: "Delete Candidate",
      message: `Are you sure you want to delete candidate "${student.name}"?`,
      onConfirm: async () => {
        try {
          const res = await axios.delete(`${API}/deleteStudent/${student._id}`, getAuthHeaders());
          if (res.data.success) {
            showToast("Candidate deleted!", "success");
            setDeleteDialog({ isOpen: false, title: "", message: "", onConfirm: null });
            fetchStudents();
            fetchDashboardStats();
          }
        } catch (err) {
          showToast(err.response?.data?.message || "Delete failed", "error");
        }
      },
    });
  };

  const handleVerifyCandidate = async (studentId, status) => {
    try {
      const res = await axios.patch(
        `${API}/api/admin/students/${studentId}/verify-document`,
        {
          documentType: "all",
          status,
          remarks: status === "verified" ? "All documents verified." : "Documents rejected.",
        },
        getAuthHeaders()
      );
      if (res.data.success) {
        showToast(`Candidate marked as ${status}!`, "success");
        setSelectedStudent(null);
        fetchStudents();
        fetchDashboardStats();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Verification failed", "error");
    }
  };

  // --- UNIVERSITY CRUD ---
  const handleSaveUniversity = async (e) => {
    e.preventDefault();
    try {
      if (editingUniversity) {
        const res = await axios.put(`${API}/updateUniversity/${editingUniversity._id}`, universityForm, getAuthHeaders());
        if (res.data.success) {
          showToast("University updated successfully!", "success");
          setEditingUniversity(null);
          setShowAddUniversityModal(false);
          fetchUniversities();
          fetchDashboardStats();
        }
      } else {
        const res = await axios.post(`${API}/addUniversity`, universityForm, getAuthHeaders());
        if (res.data.success) {
          showToast("University registered successfully!", "success");
          setShowAddUniversityModal(false);
          fetchUniversities();
          fetchDashboardStats();
        }
      }
      setUniversityForm(INITIAL_UNIVERSITY_FORM);
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleOpenEditUniversity = (uni) => {
    setEditingUniversity(uni);
    setUniversityForm({
      name: uni.name || "",
      shortName: uni.shortName || "",
      slug: uni.slug || "",
      logo: uni.logo || "",
      description: uni.description || "",
      type: uni.type || "state",
      establishedYear: uni.establishedYear || 1980,
      recognition: Array.isArray(uni.recognition) && uni.recognition.length > 0 ? uni.recognition : [{ name: "UGC", year: 1980 }],
      accreditation: Array.isArray(uni.accreditation) && uni.accreditation.length > 0 ? uni.accreditation : [{ name: "NAAC", grade: "A+", score: "3.55", year: 2023 }],
      location: {
        address: uni.location?.address || "",
        city: uni.location?.city || "",
        state: uni.location?.state || "Delhi",
        country: uni.location?.country || "India",
        pincode: uni.location?.pincode || "",
        coordinates: {
          latitude: uni.location?.coordinates?.latitude ?? "",
          longitude: uni.location?.coordinates?.longitude ?? "",
        },
      },
      contact: {
        email: uni.contact?.email || "",
        phone: uni.contact?.phone || "",
      },
      website: uni.website || "",
      status: uni.status || "active",
      isVerified: Boolean(uni.isVerified),
    });
    setShowAddUniversityModal(true);
  };

  const handleDeleteUniversity = (uni) => {
    setDeleteDialog({
      isOpen: true,
      title: "Delete University",
      message: `Are you sure you want to remove "${uni.name}"?`,
      onConfirm: async () => {
        try {
          const res = await axios.delete(`${API}/deleteUniversity/${uni._id}`, getAuthHeaders());
          if (res.data.success) {
            showToast("University moved to trash!", "success");
            setDeleteDialog({ isOpen: false, title: "", message: "", onConfirm: null });
            fetchUniversities();
            fetchDashboardStats();
          }
        } catch (err) {
          showToast(err.response?.data?.message || "Delete failed", "error");
        }
      },
    });
  };

  const handleToggleUniversityStatus = async (uni) => {
    try {
      const res = await axios.patch(`${API}/api/universities/${uni._id}/status`, {}, getAuthHeaders());
      if (res.data.success) {
        showToast(res.data.message || "University status updated", "success");
        fetchUniversities();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Status update failed", "error");
    }
  };

  const handleToggleCollegeStatus = async (col) => {
    try {
      const res = await axios.patch(`${API}/api/colleges/${col._id}/status`, {}, getAuthHeaders());
      if (res.data.success) {
        showToast(res.data.message || "College status updated", "success");
        fetchColleges();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Status update failed", "error");
    }
  };

  const handleToggleCatalogItemStatus = async (item, entityType) => {
    try {
      const targetType = entityType === "courses" && coursesSubTab === "degrees" ? "degrees" : entityType;
      const res = await axios.patch(`${API}/api/${targetType}/${item._id}/status`, {}, getAuthHeaders());
      if (res.data.success) {
        showToast(res.data.message || "Status updated", "success");
        fetchCatalog(targetType);
        preloadCatalogReferences();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Status update failed", "error");
    }
  };

  // --- COLLEGE CRUD ---
  const handleSaveCollege = async (e) => {
    e.preventDefault();
    try {
      if (editingCollege) {
        const res = await axios.put(`${API}/updateCollege/${editingCollege._id}`, collegeForm, getAuthHeaders());
        if (res.data.success) {
          showToast("College updated successfully!", "success");
          setEditingCollege(null);
          setShowAddCollegeModal(false);
          fetchColleges();
          fetchDashboardStats();
        }
      } else {
        const res = await axios.post(`${API}/addCollege`, collegeForm, getAuthHeaders());
        if (res.data.success) {
          showToast("Medical College added!", "success");
          setShowAddCollegeModal(false);
          fetchColleges();
          fetchDashboardStats();
        }
      }
      setCollegeForm(INITIAL_COLLEGE_FORM);
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleOpenEditCollege = (college) => {
    setEditingCollege(college);
    setCollegeForm({
      name: college.name || "",
      slug: college.slug || "",
      logo: college.logo || "",
      description: college.description || "",
      university: college.university?._id || college.university || "",
      collegeType: college.collegeType || "government",
      ownership: college.ownership || "State Government",
      establishedYear: college.establishedYear || 1985,
      location: {
        address: college.location?.address || college.address || "",
        city: college.location?.city || college.city || "New Delhi",
        state: college.location?.state || college.state || "Delhi",
        country: college.location?.country || college.country || "India",
        pincode: college.location?.pincode || college.pincode || "",
        coordinates: {
          latitude: college.location?.coordinates?.latitude ?? "",
          longitude: college.location?.coordinates?.longitude ?? "",
        },
      },
      website: college.website || "",
      contact: {
        email: college.contact?.email || college.email || "",
        phone: college.contact?.phone || college.phone || "",
      },
      accreditation: Array.isArray(college.accreditation) && college.accreditation.length > 0 ? college.accreditation : [{ name: "NMC", grade: "Recognized", year: 1985 }],
      ranking: Array.isArray(college.ranking) && college.ranking.length > 0 ? college.ranking : [{ organization: "NIRF", rank: 1, year: 2024 }],
      rating: college.rating || { average: 4.8, count: 240 },
      status: college.status || "active",
      isVerified: college.isVerified !== undefined ? Boolean(college.isVerified) : true,
    });
    setShowAddCollegeModal(true);
  };

  const handleDeleteCollege = (college) => {
    setDeleteDialog({
      isOpen: true,
      title: "Delete Medical College",
      message: `Are you sure you want to remove "${college.name}"?`,
      onConfirm: async () => {
        try {
          const res = await axios.delete(`${API}/deleteCollege/${college._id}`, getAuthHeaders());
          if (res.data.success) {
            showToast("College removed!", "success");
            setDeleteDialog({ isOpen: false, title: "", message: "", onConfirm: null });
            fetchColleges();
            fetchDashboardStats();
          }
        } catch (err) {
          showToast(err.response?.data?.message || "Delete failed", "error");
        }
      },
    });
  };

  // --- STREAM CRUD ---
  const handleSaveStream = async (e) => {
    e.preventDefault();
    try {
      const storedAdmin = JSON.parse(localStorage.getItem("admin") || "{}");
      const payload = {
        ...streamForm,
        ...(storedAdmin._id || storedAdmin.id
          ? { createdBy: storedAdmin._id || storedAdmin.id }
          : {}),
      };
      if (editingStream) {
        const res = await axios.put(`${API}/updateStream/${editingStream._id}`, payload, getAuthHeaders());
        if (res.data.success) {
          showToast("Academic Stream updated successfully!", "success");
          setEditingStream(null);
          setShowStreamModal(false);
          fetchCatalog("streams");
          preloadCatalogReferences();
        }
      } else {
        const res = await axios.post(`${API}/addStream`, payload, getAuthHeaders());
        if (res.data.success) {
          showToast("Academic Stream created successfully!", "success");
          setShowStreamModal(false);
          fetchCatalog("streams");
          preloadCatalogReferences();
        }
      }
      setStreamForm(INITIAL_STREAM_FORM);
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  // --- DEGREE CRUD ---
  const handleSaveDegree = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: degreeForm.name,
        shortName: degreeForm.shortName,
        code: degreeForm.code,
        slug: degreeForm.slug,
        level: degreeForm.level,
        degreeType: degreeForm.degreeType,
        defaultDuration: {
          value: Number(degreeForm.durationValue) || 3,
          unit: degreeForm.durationUnit || "years",
        },
        streams: degreeForm.streams,
        displayOrder: Number(degreeForm.displayOrder) || 0,
        status: degreeForm.status || "active",
        description: degreeForm.description,
      };

      if (editingDegree) {
        const res = await axios.put(`${API}/updateDegree/${editingDegree._id}`, payload, getAuthHeaders());
        if (res.data.success) {
          showToast("Degree qualification updated successfully!", "success");
          setEditingDegree(null);
          setShowDegreeModal(false);
          fetchCatalog("degrees");
          preloadCatalogReferences();
        }
      } else {
        const res = await axios.post(`${API}/addDegree`, payload, getAuthHeaders());
        if (res.data.success) {
          showToast("Degree qualification created successfully!", "success");
          setShowDegreeModal(false);
          fetchCatalog("degrees");
          preloadCatalogReferences();
        }
      }
      setDegreeForm(INITIAL_DEGREE_FORM);
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  // --- COURSE CRUD ---
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: courseForm.name,
        code: courseForm.code,
        slug: courseForm.slug,
        stream: courseForm.stream,
        degree: courseForm.degree,
        duration: {
          value: Number(courseForm.durationValue) || 5,
          unit: courseForm.durationUnit || "years",
        },
        eligibility: {
          minimumPercentage: Number(courseForm.minimumPercentage) || 50,
          requiredSubjects: courseForm.requiredSubjects
            ? courseForm.requiredSubjects.split(",").map((s) => s.trim()).filter(Boolean)
            : ["Physics", "Chemistry", "Biology"],
          requiredQualification: courseForm.requiredQualification || "",
        },
        description: courseForm.description,
        status: courseForm.status || "active",
      };

      if (editingCourse) {
        const res = await axios.put(`${API}/updateCourse/${editingCourse._id}`, payload, getAuthHeaders());
        if (res.data.success) {
          showToast("Course details updated successfully!", "success");
          setEditingCourse(null);
          setShowCourseModal(false);
          fetchCatalog("courses");
          preloadCatalogReferences();
        }
      } else {
        const res = await axios.post(`${API}/addCourse`, payload, getAuthHeaders());
        if (res.data.success) {
          showToast("Academic Course created successfully!", "success");
          setShowCourseModal(false);
          fetchCatalog("courses");
          preloadCatalogReferences();
        }
      }
      setCourseForm(INITIAL_COURSE_FORM);
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  // --- SPECIALIZATION CRUD ---
  const handleSaveSpecialization = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: specializationForm.name,
        code: specializationForm.code,
        slug: specializationForm.slug,
        course: specializationForm.course,
        duration: {
          value: Number(specializationForm.durationValue) || 3,
          unit: specializationForm.durationUnit || "years",
        },
        eligibility: {
          minimumPercentage: Number(specializationForm.minimumPercentage) || 55,
          requiredSubjects: specializationForm.requiredSubjects
            ? specializationForm.requiredSubjects.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          requiredQualification: specializationForm.requiredQualification || "",
        },
        careerOptions: specializationForm.careerOptions
          ? specializationForm.careerOptions.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        description: specializationForm.description,
        status: specializationForm.status || "active",
      };

      if (editingSpecialization) {
        const res = await axios.put(`${API}/updateSpecialization/${editingSpecialization._id}`, payload, getAuthHeaders());
        if (res.data.success) {
          showToast("Clinical specialization updated successfully!", "success");
          setEditingSpecialization(null);
          setShowSpecializationModal(false);
          fetchCatalog("specializations");
        }
      } else {
        const res = await axios.post(`${API}/addSpecialization`, payload, getAuthHeaders());
        if (res.data.success) {
          showToast("Clinical specialization created successfully!", "success");
          setShowSpecializationModal(false);
          fetchCatalog("specializations");
        }
      }
      setSpecializationForm(INITIAL_SPECIALIZATION_FORM);
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleOpenAddCatalogItem = () => {
    preloadCatalogReferences();
    if (activeTab === "streams") {
      setEditingStream(null);
      setStreamForm(INITIAL_STREAM_FORM);
      setShowStreamModal(true);
    } else if (activeTab === "degrees") {
      setEditingDegree(null);
      setDegreeForm(INITIAL_DEGREE_FORM);
      setShowDegreeModal(true);
    } else if (activeTab === "courses") {
      setEditingCourse(null);
      setCourseForm(INITIAL_COURSE_FORM);
      setShowCourseModal(true);
    } else if (activeTab === "specializations") {
      setEditingSpecialization(null);
      setSpecializationForm(INITIAL_SPECIALIZATION_FORM);
      setShowSpecializationModal(true);
    }
  };

  const handleOpenEditCatalogItem = (item) => {
    preloadCatalogReferences();
    if (activeTab === "streams") {
      setEditingStream(item);
      setStreamForm({
        name: item.name || "",
        code: item.code || "",
        slug: item.slug || "",
        description: item.description || "",
        icon: item.icon || "Stethoscope",
        image: item.image || "",
        parentStream: item.parentStream?._id || item.parentStream || "",
        displayOrder: item.displayOrder ?? 0,
        status: item.status || "active",
      });
      setShowStreamModal(true);
    } else if (activeTab === "degrees") {
      setEditingDegree(item);
      setDegreeForm({
        name: item.name || "",
        shortName: item.shortName || item.code || "",
        code: item.code || "",
        slug: item.slug || "",
        level: item.level || "undergraduate",
        degreeType: item.degreeType || "professional",
        durationValue: item.defaultDuration?.value || 3,
        durationUnit: item.defaultDuration?.unit || "years",
        streams: Array.isArray(item.streams) ? item.streams.map((s) => s._id || s) : [],
        displayOrder: item.displayOrder ?? 0,
        status: item.status || "active",
        description: item.description || "",
      });
      setShowDegreeModal(true);
    } else if (activeTab === "courses") {
      setEditingCourse(item);
      setCourseForm({
        name: item.name || "",
        code: item.code || "",
        slug: item.slug || "",
        stream: item.stream?._id || item.stream || "",
        degree: item.degree?._id || item.degree || "",
        durationValue: item.duration?.value || 5,
        durationUnit: item.duration?.unit || "years",
        minimumPercentage: item.eligibility?.minimumPercentage ?? 50,
        requiredSubjects: Array.isArray(item.eligibility?.requiredSubjects)
          ? item.eligibility.requiredSubjects.join(", ")
          : (item.eligibility?.requiredSubjects || "Physics, Chemistry, Biology"),
        requiredQualification: item.eligibility?.requiredQualification || "",
        description: item.description || "",
        status: item.status || "active",
      });
      setShowCourseModal(true);
    } else if (activeTab === "specializations") {
      setEditingSpecialization(item);
      setSpecializationForm({
        name: item.name || "",
        code: item.code || "",
        slug: item.slug || "",
        course: item.course?._id || item.course || "",
        durationValue: item.duration?.value || 3,
        durationUnit: item.duration?.unit || "years",
        minimumPercentage: item.eligibility?.minimumPercentage ?? 55,
        requiredSubjects: Array.isArray(item.eligibility?.requiredSubjects)
          ? item.eligibility.requiredSubjects.join(", ")
          : "",
        requiredQualification: item.eligibility?.requiredQualification || "",
        careerOptions: Array.isArray(item.careerOptions) ? item.careerOptions.join(", ") : "",
        description: item.description || "",
        status: item.status || "active",
      });
      setShowSpecializationModal(true);
    }
  };

  const handleDeleteCatalogItem = (item) => {
    setDeleteDialog({
      isOpen: true,
      title: `Delete ${activeTab.slice(0, -1)}`,
      message: `Are you sure you want to delete "${item.name}"?`,
      onConfirm: async () => {
        try {
          let deleteEndpoint = `/deleteStream/${item._id}`;
          if (activeTab === "degrees") deleteEndpoint = `/deleteDegree/${item._id}`;
          if (activeTab === "courses") deleteEndpoint = `/deleteCourse/${item._id}`;
          if (activeTab === "specializations") deleteEndpoint = `/deleteSpecialization/${item._id}`;

          const res = await axios.delete(`${API}${deleteEndpoint}`, getAuthHeaders());
          if (res.data.success) {
            showToast("Item deleted!", "success");
            setDeleteDialog({ isOpen: false, title: "", message: "", onConfirm: null });
            fetchCatalog(activeTab);
          }
        } catch (err) {
          showToast(err.response?.data?.message || "Delete failed", "error");
        }
      },
    });
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      (s.name || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.neetRollNumber || "").toLowerCase().includes(studentSearch.toLowerCase());
    const matchesStatus =
      studentStatusFilter === "all" ||
      (studentStatusFilter === "verified" && s.isVerified) ||
      (studentStatusFilter === "pending" && !s.isVerified);
    return matchesSearch && matchesStatus;
  });

  const filteredColleges = colleges.filter((c) => {
    const matchesSearch =
      (c.name || "").toLowerCase().includes(collegeSearch.toLowerCase()) ||
      (c.city || "").toLowerCase().includes(collegeSearch.toLowerCase());
    const matchesType =
      collegeTypeFilter === "all" || c.collegeType === collegeTypeFilter;
    const matchesUniversity =
      collegeUniversityFilter === "all" ||
      String(c.university?._id || c.university) === collegeUniversityFilter;
    return matchesSearch && matchesType && matchesUniversity;
  });

  const filteredUniversities = universities.filter((u) => {
    const matchesSearch =
      (u.name || "").toLowerCase().includes(universitySearch.toLowerCase()) ||
      (u.shortName || "").toLowerCase().includes(universitySearch.toLowerCase()) ||
      (u.location?.city || u.city || "").toLowerCase().includes(universitySearch.toLowerCase()) ||
      (u.location?.state || u.state || "").toLowerCase().includes(universitySearch.toLowerCase());
    const matchesType =
      universityTypeFilter === "all" || u.type === universityTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredCatalogItems = catalogItems.filter((item) => {
    const matchesSearch =
      !catalogSearch ||
      (item.name || "").toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (item.code || "").toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (item.shortName || "").toLowerCase().includes(catalogSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "courses" && coursesSubTab === "courses") {
      if (catalogStreamFilter !== "all") {
        const sId = item.stream?._id || item.stream;
        if (String(sId) !== catalogStreamFilter) return false;
      }
      if (catalogDegreeFilter !== "all") {
        const dId = item.degree?._id || item.degree;
        if (String(dId) !== catalogDegreeFilter) return false;
      }
    }

    if (activeTab === "specializations") {
      if (catalogCourseFilter !== "all") {
        const cId = item.course?._id || item.course;
        if (String(cId) !== catalogCourseFilter) return false;
      }
    }

    return true;
  });

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 text-slate-800 antialiased font-sans">
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-semibold flex items-center gap-3 transition-all ${
            toast.type === "success"
              ? "bg-slate-900 border-emerald-500/50 text-emerald-300"
              : "bg-slate-900 border-rose-500/50 text-rose-300"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{deleteDialog.title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{deleteDialog.message}</p>
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setDeleteDialog({ isOpen: false, title: "", message: "", onConfirm: null })}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={deleteDialog.onConfirm}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generic Item Details / Inspect Modal (Read operation for ALL entities) */}
      <ItemDetailsModal
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        item={viewingItem?.item}
        type={viewingItem?.type}
        onEdit={(item) => {
          if (viewingItem?.type === "students") handleOpenEditStudent(item);
          else if (viewingItem?.type === "colleges") handleOpenEditCollege(item);
          else if (viewingItem?.type === "universities") handleOpenEditUniversity(item);
          else handleOpenEditCatalogItem(item);
        }}
        onDelete={(item) => {
          if (viewingItem?.type === "students") handleDeleteStudent(item);
          else if (viewingItem?.type === "colleges") handleDeleteCollege(item);
          else if (viewingItem?.type === "universities") handleDeleteUniversity(item);
          else handleDeleteCatalogItem(item);
        }}
        onVerify={(student, status) => {
          handleVerifyCandidate(student._id, status);
          setViewingItem(null);
        }}
      />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          totalStudents: stats.totalStudents,
          totalUniversities: universities.length,
          totalColleges: stats.totalColleges,
          totalDegrees: (allDegrees || []).length,
          totalStreams: (allStreams || []).length,
          totalCourses: (allCourses || []).length,
          totalSpecializations: (allSpecializations || []).length,
          totalTemplates: templatesCount,
        }}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
            <span onClick={() => setActiveTab("overview")} className="hover:text-indigo-600 cursor-pointer">
              Admissions Desk
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-bold capitalize">
              {activeTab === "email-templates"
                ? "Email Templates"
                : activeTab === "students"
                ? "Student Directory"
                : activeTab === "universities"
                ? "University Directory"
                : activeTab === "colleges"
                ? "College Directory"
                : activeTab === "courses"
                ? "Courses Directory"
                : activeTab === "specializations"
                ? "Specializations Directory"
                : activeTab === "degrees"
                ? "Degrees Directory"
                : activeTab === "streams"
                ? "Streams Directory"
                : activeTab}
            </span>
          </div>

          <button
            onClick={() => {
              fetchDashboardStats();
              if (activeTab === "students") fetchStudents();
              if (activeTab === "universities") fetchUniversities();
              if (activeTab === "colleges") fetchColleges();
              if (["streams", "degrees", "courses", "specializations"].includes(activeTab)) {
                fetchCatalog(activeTab);
              }
              showToast("Data synchronized", "success");
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition border border-slate-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Admissions Operations Console</h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  National NEET-UG document verification, institution rosters, and student admissions processing.
                </p>
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => {
                      setEditingStudent(null);
                      setStudentForm({
                        name: "",
                        email: "",
                        password: "Password@123",
                        gender: "male",
                        age: "19",
                        phone: "",
                        category: "GEN",
                        neetRollNumber: "",
                        neetScore: "",
                        neetAllIndiaRank: "",
                      });
                      setShowAddStudentModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Enroll Student</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingCollege(null);
                      setCollegeForm(INITIAL_COLLEGE_FORM);
                      setShowAddCollegeModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-bold transition cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Add College</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div
                  onClick={() => setActiveTab("students")}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs card-hover cursor-pointer group transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Students</span>
                    <Users className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono-numbers">{stats.totalStudents || 0}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center justify-between">
                    <span>Active Candidates</span>
                    <span className="text-indigo-600 font-bold group-hover:underline">Manage &rarr;</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("colleges")}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs card-hover cursor-pointer group transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Colleges</span>
                    <Building2 className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono-numbers">{stats.totalColleges || 0}</div>
                  <div className="text-xs text-sky-600 font-semibold mt-1 flex items-center justify-between">
                    <span>MBBS Institutions</span>
                    <span className="text-sky-600 font-bold group-hover:underline">Manage &rarr;</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab("students");
                    setStudentStatusFilter("verified");
                  }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs card-hover cursor-pointer group transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Documents</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono-numbers">{stats.verifiedApplications || 0}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center justify-between">
                    <span>Credentials Checked</span>
                    <span className="text-emerald-700 font-bold group-hover:underline">View Verified &rarr;</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab("students");
                    setStudentStatusFilter("pending");
                  }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs card-hover cursor-pointer group transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Review</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono-numbers">{stats.pendingApplications || 0}</div>
                  <div className="text-xs text-amber-600 font-semibold mt-1 flex items-center justify-between">
                    <span>Awaiting Verification</span>
                    <span className="text-amber-700 font-bold group-hover:underline">Verify Now &rarr;</span>
                  </div>
                </div>
              </div>

              {/* ACADEMIC & INSTITUTIONAL CRUD COMMAND HUB */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Academic Catalog & Entity Hub</h2>
                    <p className="text-xs text-slate-500">Quick create, view, edit and delete management on all educational entities</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* COURSES CRUD CARD */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs card-hover flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                          <Layers className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {stats.totalCourses !== undefined ? stats.totalCourses : (allCourses || []).length} Courses
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Academic Courses</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        MBBS, BDS, MD, MS degree programs, syllabus durations & eligibility criteria.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCourse(null);
                          setCourseForm(INITIAL_COURSE_FORM);
                          setShowCourseModal(true);
                        }}
                        className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Course</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("courses")}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Manage &rarr;
                      </button>
                    </div>
                  </div>

                  {/* DEGREES CRUD CARD */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs card-hover flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          {stats.totalDegrees !== undefined ? stats.totalDegrees : (allDegrees || []).length} Degrees
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Degrees & Qualifications</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Undergraduate (UG), Postgraduate (PG), Super Speciality (SS) & Diploma levels.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingDegree(null);
                          setDegreeForm(INITIAL_DEGREE_FORM);
                          setShowDegreeModal(true);
                        }}
                        className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Degree</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("degrees")}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Manage &rarr;
                      </button>
                    </div>
                  </div>

                  {/* STREAMS CRUD CARD */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs card-hover flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {stats.totalStreams !== undefined ? stats.totalStreams : (allStreams || []).length} Streams
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Academic Streams</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Allopathy, Dental, AYUSH, Nursing & Allied Medical Sciences.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingStream(null);
                          setStreamForm(INITIAL_STREAM_FORM);
                          setShowStreamModal(true);
                        }}
                        className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Stream</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("streams")}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Manage &rarr;
                      </button>
                    </div>
                  </div>

                  {/* SPECIALIZATIONS CRUD CARD */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs card-hover flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          {stats.totalSpecializations !== undefined ? stats.totalSpecializations : (allSpecializations || []).length} Branches
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Clinical Specializations</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Cardiology, Neurology, Pediatrics, Orthopedics, General Surgery branches.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingSpecialization(null);
                          setSpecializationForm(INITIAL_SPECIALIZATION_FORM);
                          setShowSpecializationModal(true);
                        }}
                        className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Branch</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("specializations")}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Manage &rarr;
                      </button>
                    </div>
                  </div>

                  {/* COLLEGES CRUD CARD */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs card-hover flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {stats.totalColleges !== undefined ? stats.totalColleges : colleges.length} Colleges
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Participating Colleges</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Government, Private, Deemed medical institutions and seat matrices.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCollege(null);
                          setCollegeForm(INITIAL_COLLEGE_FORM);
                          setShowAddCollegeModal(true);
                        }}
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add College</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("colleges")}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Manage &rarr;
                      </button>
                    </div>
                  </div>

                  {/* UNIVERSITIES CRUD CARD */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs card-hover flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                          <Landmark className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {stats.totalUniversities !== undefined ? stats.totalUniversities : universities.length} Universities
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Affiliated Universities</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Central, State, Deemed & Private medical universities & affiliations.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingUniversity(null);
                          setUniversityForm(INITIAL_UNIVERSITY_FORM);
                          setShowAddUniversityModal(true);
                        }}
                        className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add University</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("universities")}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Manage &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[300px]">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search students by name, roll no..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <select
                    value={studentStatusFilter}
                    onChange={(e) => setStudentStatusFilter(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700"
                  >
                    <option value="all">All Verification Statuses</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setStudentViewMode("table")}
                      className={`p-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        studentViewMode === "table" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Table className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setStudentViewMode("card")}
                      className={`p-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        studentViewMode === "card" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setEditingStudent(null);
                      setStudentForm({
                        name: "",
                        email: "",
                        password: "Password@123",
                        gender: "male",
                        age: "19",
                        phone: "",
                        category: "GEN",
                        neetRollNumber: "",
                        neetScore: "",
                        neetAllIndiaRank: "",
                      });
                      setShowAddStudentModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-xs transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Enroll Student</span>
                  </button>
                </div>
              </div>


              {studentLoading ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2 text-indigo-500" />
                  Loading Students...
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
                  No students found.
                </div>
              ) : studentViewMode === "table" ? (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                          <th className="py-3.5 px-4">Student</th>
                          <th className="py-3.5 px-4">NEET Roll</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((student) => (
                          <tr key={student._id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4 font-bold text-slate-900">{student.name}</td>
                            <td className="py-3.5 px-4 font-mono text-slate-700 font-medium">{student.neetRollNumber || "—"}</td>
                            <td className="py-3.5 px-4 font-semibold text-slate-700">{student.category || "GEN"}</td>
                            <td className="py-3.5 px-4">
                              {student.isVerified ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <Check className="w-3.5 h-3.5" /> Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Clock className="w-3.5 h-3.5" /> Pending
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5">
                              <button
                                onClick={() => setViewingItem({ item: student, type: "students" })}
                                className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
                                title="Inspect"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEditStudent(student)}
                                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student)}
                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredStudents.map((student) => (
                    <div key={student._id} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between card-hover">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-base font-bold text-slate-900">{student.name}</h4>
                          {student.isVerified ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mb-4">{student.email}</p>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 mb-4">
                          <div><span className="text-slate-400">Roll:</span> <span className="font-mono font-bold text-slate-800 ml-1">{student.neetRollNumber || "—"}</span></div>
                          <div><span className="text-slate-400">Score:</span> <span className="font-bold text-indigo-600 ml-1 text-sm">{student.neetScore || "N/A"}</span></div>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setViewingItem({ item: student, type: "students" })}
                          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditStudent(student)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "universities" && (
            <div className="space-y-4">
              {/* Filter and Action Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search universities by name, acronym, city or state..."
                    value={universitySearch}
                    onChange={(e) => setUniversitySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={universityTypeFilter}
                    onChange={(e) => setUniversityTypeFilter(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All University Types</option>
                    <option value="central">Central Universities</option>
                    <option value="state">State Universities</option>
                    <option value="private">Private Universities</option>
                    <option value="deemed">Deemed Universities</option>
                    <option value="international">International Universities</option>
                    <option value="other">Other / Autonomous</option>
                  </select>

                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setUniversityViewMode("card")}
                      className={`p-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        universityViewMode === "card" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                      title="Card Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setUniversityViewMode("table")}
                      className={`p-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        universityViewMode === "table" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                      title="Table View"
                    >
                      <Table className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setEditingUniversity(null);
                      setUniversityForm(INITIAL_UNIVERSITY_FORM);
                      setShowAddUniversityModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-xs transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add University</span>
                  </button>
                </div>
              </div>

              {/* Statistics Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Total Registered</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{universities.length}</div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-indigo-500 font-semibold uppercase">Central Universities</div>
                  <div className="text-xl font-bold text-indigo-700 mt-1">
                    {universities.filter((u) => u.type === "central").length}
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-blue-500 font-semibold uppercase">State Universities</div>
                  <div className="text-xl font-bold text-blue-700 mt-1">
                    {universities.filter((u) => u.type === "state").length}
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-emerald-500 font-semibold uppercase">Officially Verified</div>
                  <div className="text-xl font-bold text-emerald-700 mt-1">
                    {universities.filter((u) => u.isVerified).length}
                  </div>
                </div>
              </div>

              {/* Content rendering: Cards vs Table */}
              {filteredUniversities.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
                  No universities found matching criteria. Click &quot;Add University&quot; to register one.
                </div>
              ) : universityViewMode === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredUniversities.map((uni) => (
                    <div
                      key={uni._id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between card-hover"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span
                            className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                              uni.type === "central"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : uni.type === "state"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : uni.type === "deemed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {uni.type || "state"} University
                          </span>
                          {uni.isVerified && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                          {uni.logo ? (
                            <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                              <img src={uni.logo} alt={uni.name} className="max-h-full max-w-full object-contain" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                              <Landmark className="w-6 h-6" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                              {uni.name}
                            </h4>
                            {uni.shortName && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 font-mono mt-0.5">
                                {uni.shortName}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {uni.location?.city || uni.city || "—"}, {uni.location?.state || uni.state || "—"}
                          </span>
                        </p>

                        {/* Badges for Recognition / Accreditation */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          {Array.isArray(uni.recognition) &&
                            uni.recognition.slice(0, 3).map((r, i) => (
                              <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">
                                {r.name || "Approved"}
                              </span>
                            ))}
                          {Array.isArray(uni.accreditation) &&
                            uni.accreditation.slice(0, 2).map((a, i) => (
                              <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold">
                                {a.name} {a.grade || ""}
                              </span>
                            ))}
                        </div>

                        {uni.description && (
                          <p className="text-xs text-slate-500 mt-2.5 line-clamp-2">
                            {uni.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono">
                          Est. {uni.establishedYear || "—"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleUniversityStatus(uni)}
                            className={`p-2 rounded-lg transition cursor-pointer ${
                              uni.status === "active"
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-700"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                            }`}
                            title={uni.status === "active" ? "Deactivate University" : "Activate University"}
                          >
                            {uni.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setViewingItem({ item: uni, type: "universities" })}
                            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition cursor-pointer"
                            title="Inspect University"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditUniversity(uni)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                            title="Edit University"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUniversity(uni)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                            title="Delete University"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                        <th className="py-3.5 px-4">University Name</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Est. Year</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUniversities.map((uni) => (
                        <tr key={uni._id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <Landmark className="w-4 h-4 text-indigo-600 shrink-0" />
                              <div>
                                <span>{uni.name}</span>
                                {uni.shortName && (
                                  <span className="ml-2 text-xs font-mono font-normal text-slate-500">
                                    ({uni.shortName})
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 capitalize font-semibold text-slate-700">
                            {uni.type}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {uni.location?.city || uni.city || "—"}, {uni.location?.state || uni.state || "—"}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {uni.establishedYear || "—"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                                uni.status === "active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {uni.status || "active"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => handleToggleUniversityStatus(uni)}
                              className={`p-2 rounded-lg transition cursor-pointer ${
                                uni.status === "active"
                                  ? "bg-amber-50 hover:bg-amber-100 text-amber-700"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                              }`}
                              title={uni.status === "active" ? "Deactivate" : "Activate"}
                            >
                              {uni.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleOpenEditUniversity(uni)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUniversity(uni)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "colleges" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search medical institutions..."
                    value={collegeSearch}
                    onChange={(e) => setCollegeSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* University Filter */}
                <select
                  value={collegeUniversityFilter}
                  onChange={(e) => setCollegeUniversityFilter(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Universities ({allUniversities.length})</option>
                  {allUniversities.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} {u.shortName ? `(${u.shortName})` : ""}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setCollegeViewMode("card")}
                      className={`p-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        collegeViewMode === "card" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCollegeViewMode("table")}
                      className={`p-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        collegeViewMode === "table" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Table className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setEditingCollege(null);
                      setCollegeForm(INITIAL_COLLEGE_FORM);
                      setShowAddCollegeModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-xs transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add College</span>
                  </button>
                </div>
              </div>

              {filteredColleges.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
                  No medical colleges found.
                </div>
              ) : collegeViewMode === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredColleges.map((college) => (
                    <div key={college._id} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between card-hover">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-1 rounded text-xs font-bold uppercase bg-slate-100 text-slate-700">
                            {college.collegeType}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                              college.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {college.status || "active"}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1 mb-1">{college.name}</h4>
                        <p className="text-xs text-slate-500">{college.location?.city || college.city || "—"}, {college.location?.state || college.state || "—"}</p>
                        {college.university && (
                          <p className="text-xs text-indigo-600 font-medium mt-1">
                            Affiliated: {college.university.name || college.university}
                          </p>
                        )}
                      </div>
                      <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono">
                          Est. {college.establishedYear || "—"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleCollegeStatus(college)}
                            className={`p-2 rounded-lg transition cursor-pointer ${
                              college.status === "active"
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-700"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                            }`}
                            title={college.status === "active" ? "Deactivate" : "Activate"}
                          >
                            {college.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setViewingItem({ item: college, type: "colleges" })}
                            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition cursor-pointer"
                            title="Inspect College"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditCollege(college)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                            title="Edit College"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCollege(college)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                            title="Delete College"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                        <th className="py-3.5 px-4">College Name</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredColleges.map((college) => (
                        <tr key={college._id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div>{college.name}</div>
                            {college.university && (
                              <div className="text-xs text-indigo-600 font-normal">
                                {college.university.name || college.university}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 capitalize font-semibold text-slate-700">{college.collegeType}</td>
                          <td className="py-3.5 px-4 text-slate-600">{college.location?.city || college.city}, {college.location?.state || college.state}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                                college.status === "active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {college.status || "active"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => handleToggleCollegeStatus(college)}
                              className={`p-2 rounded-lg transition cursor-pointer ${
                                college.status === "active"
                                  ? "bg-amber-50 hover:bg-amber-100 text-amber-700"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                              }`}
                              title={college.status === "active" ? "Deactivate" : "Activate"}
                            >
                              {college.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setViewingItem({ item: college, type: "colleges" })}
                              className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
                              title="Inspect"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditCollege(college)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCollege(college)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {["streams", "degrees", "courses", "specializations"].includes(activeTab) && (
            <div className="space-y-4">
              {/* Header and Add Action */}
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900 capitalize">
                    {activeTab === "courses"
                      ? coursesSubTab === "degrees"
                        ? "Degrees & Qualifications"
                        : "Academic Courses"
                      : `${activeTab} Directory`}
                  </h3>

                  {/* Sub-tab toggle for Courses / Degrees */}
                  {activeTab === "courses" && (
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                      <button
                        onClick={() => {
                          setCoursesSubTab("courses");
                          fetchCatalog("courses");
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          coursesSubTab === "courses"
                            ? "bg-white text-indigo-600 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Courses ({allCourses.length})
                      </button>
                      <button
                        onClick={() => {
                          setCoursesSubTab("degrees");
                          fetchCatalog("degrees");
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          coursesSubTab === "degrees"
                            ? "bg-white text-indigo-600 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Degrees ({allDegrees.length})
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (activeTab === "courses" && coursesSubTab === "degrees") {
                      setEditingDegree(null);
                      setDegreeForm(INITIAL_DEGREE_FORM);
                      setShowDegreeModal(true);
                    } else {
                      handleOpenAddCatalogItem();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span className="capitalize">
                    Add {activeTab === "courses" && coursesSubTab === "degrees" ? "Degree" : activeTab.slice(0, -1)}
                  </span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Course Stream & Degree Filters */}
                {activeTab === "courses" && coursesSubTab === "courses" && (
                  <>
                    <select
                      value={catalogStreamFilter}
                      onChange={(e) => setCatalogStreamFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="all">All Streams</option>
                      {allStreams.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>

                    <select
                      value={catalogDegreeFilter}
                      onChange={(e) => setCatalogDegreeFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="all">All Degrees</option>
                      {allDegrees.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name} ({d.level})
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {/* Specialization Course Filter */}
                {activeTab === "specializations" && (
                  <select
                    value={catalogCourseFilter}
                    onChange={(e) => setCatalogCourseFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Parent Courses</option>
                    {allCourses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {filteredCatalogItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
                  No records matching search or filters. Click &quot;Add&quot; to register new data.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCatalogItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs card-hover flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {item.code || item.shortName || "CATALOG"}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.status === "inactive"
                                ? "bg-slate-100 text-slate-500"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            }`}
                          >
                            {item.status || "active"}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 leading-snug">{item.name}</h4>

                        {item.parentStream?.name && (
                          <p className="text-xs text-indigo-600 font-semibold mt-1.5 flex items-center gap-1">
                            <span>↳ Parent Stream:</span>
                            <span>{item.parentStream.name}</span>
                          </p>
                        )}

                        {item.level && (
                          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-600">
                            <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium">
                              {item.level}
                            </span>
                            {item.typicalDuration && (
                              <span className="text-slate-500 text-[11px] font-mono">
                                {item.typicalDuration}
                              </span>
                            )}
                          </div>
                        )}

                        {item.degree && (
                          <p className="text-xs text-slate-600 mt-1.5">
                            <span className="text-slate-400">Degree:</span>{" "}
                            <span className="font-semibold text-slate-800">
                              {item.degree.shortName || item.degree.name || "MBBS"}
                            </span>
                          </p>
                        )}

                        {item.stream && (
                          <p className="text-xs text-slate-600 mt-1">
                            <span className="text-slate-400">Stream:</span>{" "}
                            <span className="font-semibold text-slate-800">
                              {item.stream.name || item.stream.code}
                            </span>
                          </p>
                        )}

                        {item.course && (
                          <p className="text-xs text-slate-600 mt-1.5">
                            <span className="text-slate-400">Course:</span>{" "}
                            <span className="font-semibold text-slate-800">
                              {item.course.name || item.course.code}
                            </span>
                          </p>
                        )}

                        {item.description && (
                          <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400">
                          {item.displayOrder !== undefined ? `Order: #${item.displayOrder}` : "Catalog"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleCatalogItemStatus(item, activeTab === "courses" && coursesSubTab === "degrees" ? "degrees" : activeTab)}
                            className={`p-2 rounded-lg transition cursor-pointer ${
                              item.status === "active"
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-700"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                            }`}
                            title={item.status === "active" ? "Deactivate" : "Activate"}
                          >
                            {item.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setViewingItem({ item, type: activeTab === "courses" && coursesSubTab === "degrees" ? "degrees" : activeTab })}
                            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition cursor-pointer"
                            title={`Inspect ${activeTab.slice(0, -1)}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (activeTab === "courses" && coursesSubTab === "degrees") {
                                setEditingDegree(item);
                                setDegreeForm({
                                  name: item.name || "",
                                  shortName: item.shortName || "",
                                  code: item.code || "",
                                  level: item.level || "undergraduate",
                                  typicalDuration: item.typicalDuration || "5.5 years",
                                  description: item.description || "",
                                  status: item.status || "active",
                                });
                                setShowDegreeModal(true);
                              } else {
                                handleOpenEditCatalogItem(item);
                              }
                            }}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCatalogItem(item)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Email Templates Tab */}
          {activeTab === "email-templates" && (
            <EmailTemplatesTab
              onTemplatesUpdated={(count) => setTemplatesCount(count)}
            />
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <ApplicationsTab
              showToast={showToast}
              hasPermission={hasPermission}
            />
          )}

          {/* Roles & Permissions Tab */}
          {activeTab === "roles" && (
            <RolesTab
              showToast={showToast}
            />
          )}
        </div>
      </main>

      {/* Comprehensive Student Dossier Modal */}
      {selectedStudent && (
        <ItemDetailsModal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          item={selectedStudent}
          type="students"
          onEdit={(item) => {
            setSelectedStudent(null);
            handleOpenEditStudent(item);
          }}
          onDelete={(item) => {
            setSelectedStudent(null);
            handleDeleteStudent(item);
          }}
          onVerify={(student, status) => {
            handleVerifyCandidate(student._id, status);
            setSelectedStudent(null);
          }}
        />
      )}

      {/* Add / Edit Student Modal */}
      {/* Schema-compliant Add / Edit Student Modal */}
      <StudentModal
        isOpen={showAddStudentModal}
        onClose={() => {
          setShowAddStudentModal(false);
          setEditingStudent(null);
        }}
        onSubmit={handleSaveStudent}
        studentForm={studentForm}
        setStudentForm={setStudentForm}
        editingStudent={editingStudent}
      />

      {/* Schema-compliant Add / Edit University Modal */}
      <UniversityModal
        isOpen={showAddUniversityModal}
        onClose={() => {
          setShowAddUniversityModal(false);
          setEditingUniversity(null);
        }}
        onSubmit={handleSaveUniversity}
        universityForm={universityForm}
        setUniversityForm={setUniversityForm}
        editingUniversity={editingUniversity}
      />

      {/* Schema-compliant Add / Edit College Modal */}
      <CollegeModal
        isOpen={showAddCollegeModal}
        onClose={() => {
          setShowAddCollegeModal(false);
          setEditingCollege(null);
        }}
        onSubmit={handleSaveCollege}
        collegeForm={collegeForm}
        setCollegeForm={setCollegeForm}
        editingCollege={editingCollege}
        universities={universities}
      />

      {/* Schema-compliant Add / Edit Stream Modal */}
      <StreamModal
        isOpen={showStreamModal}
        onClose={() => {
          setShowStreamModal(false);
          setEditingStream(null);
        }}
        onSubmit={handleSaveStream}
        streamForm={streamForm}
        setStreamForm={setStreamForm}
        editingStream={editingStream}
        allStreams={allStreams}
      />

      {/* Schema-compliant Add / Edit Degree Modal */}
      <DegreeModal
        isOpen={showDegreeModal}
        onClose={() => {
          setShowDegreeModal(false);
          setEditingDegree(null);
        }}
        onSubmit={handleSaveDegree}
        degreeForm={degreeForm}
        setDegreeForm={setDegreeForm}
        editingDegree={editingDegree}
        allStreams={allStreams}
      />

      {/* Schema-compliant Add / Edit Course Modal */}
      <CourseModal
        isOpen={showCourseModal}
        onClose={() => {
          setShowCourseModal(false);
          setEditingCourse(null);
        }}
        onSubmit={handleSaveCourse}
        courseForm={courseForm}
        setCourseForm={setCourseForm}
        editingCourse={editingCourse}
        allStreams={allStreams}
        allDegrees={allDegrees}
      />

      {/* Schema-compliant Add / Edit Specialization Modal */}
      <SpecializationModal
        isOpen={showSpecializationModal}
        onClose={() => {
          setShowSpecializationModal(false);
          setEditingSpecialization(null);
        }}
        onSubmit={handleSaveSpecialization}
        specializationForm={specializationForm}
        setSpecializationForm={setSpecializationForm}
        editingSpecialization={editingSpecialization}
        allCourses={allCourses}
      />
    </div>
  );
};

export default AdminDashborad;
