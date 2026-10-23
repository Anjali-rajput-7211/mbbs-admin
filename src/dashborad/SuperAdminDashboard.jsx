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
  ShieldCheck,
  Search,
  Plus,
  RefreshCw,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  TrendingUp,
  FileCheck,
  Building,
  Check,
  AlertTriangle,
  Table,
  Grid,
  Mail,
  MapPin,
  Sparkles,
  UserCheck,
  UserX,
  Phone,
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

import ApplicationsTab from "../pages/ApplicationsTab";
import RolesTab from "../pages/RolesTab";
import ItemDetailsModal from "../pages/ItemDetailsModal";

const API = "http://localhost:5000";

const PERMISSION_OPTIONS = [
  // 1. Students
  { id: "view_students", label: "View Students", category: "Student" },
  { id: "create_students", label: "Create Students", category: "Student" },
  { id: "edit_students", label: "Edit Students", category: "Student" },
  { id: "delete_students", label: "Delete Students", category: "Student" },
  // 2. Universities
  { id: "view_universities", label: "View Universities", category: "University" },
  { id: "create_universities", label: "Create Universities", category: "University" },
  { id: "edit_universities", label: "Edit Universities", category: "University" },
  { id: "delete_universities", label: "Delete Universities", category: "University" },
  // 3. Colleges
  { id: "view_colleges", label: "View Colleges", category: "College" },
  { id: "create_colleges", label: "Create Colleges", category: "College" },
  { id: "edit_colleges", label: "Edit Colleges", category: "College" },
  { id: "delete_colleges", label: "Delete Colleges", category: "College" },
  // 4. Degrees
  { id: "view_degrees", label: "View Degrees", category: "Degree" },
  { id: "create_degrees", label: "Create Degrees", category: "Degree" },
  { id: "edit_degrees", label: "Edit Degrees", category: "Degree" },
  { id: "delete_degrees", label: "Delete Degrees", category: "Degree" },
  // 5. Streams
  { id: "view_streams", label: "View Streams", category: "Stream" },
  { id: "create_streams", label: "Create Streams", category: "Stream" },
  { id: "edit_streams", label: "Edit Streams", category: "Stream" },
  { id: "delete_streams", label: "Delete Streams", category: "Stream" },
  // 6. Specializations
  { id: "view_specializations", label: "View Specializations", category: "Specialization" },
  { id: "create_specializations", label: "Create Specializations", category: "Specialization" },
  { id: "edit_specializations", label: "Edit Specializations", category: "Specialization" },
  { id: "delete_specializations", label: "Delete Specializations", category: "Specialization" },
  // 7. Applications
  { id: "view_applications", label: "View Applications", category: "Application" },
  { id: "create_applications", label: "Create Applications", category: "Application" },
  { id: "edit_applications", label: "Edit Applications", category: "Application" },
  { id: "delete_applications", label: "Delete Applications", category: "Application" },
  // 8. Email Templates
  { id: "view_email_templates", label: "View Email Templates", category: "Email Template" },
  { id: "create_email_templates", label: "Create Email Templates", category: "Email Template" },
  { id: "edit_email_templates", label: "Edit Email Templates", category: "Email Template" },
  { id: "delete_email_templates", label: "Delete Email Templates", category: "Email Template" },
];

const SuperAdminDashboard = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState("overview");
  const [templatesCount, setTemplatesCount] = useState(0);

  // View Mode Toggles (Grid vs Table)
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

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  // Dashboard Stats
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAdmins: 0,
    totalColleges: 0,
    totalCourses: 0,
    totalApplications: 0,
    verifiedApplications: 0,
    pendingApplications: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // Admins State
  const [admins, setAdmins] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminStatusFilter, setAdminStatusFilter] = useState("all");
  const [adminRoleFilter, setAdminRoleFilter] = useState("all");
  const [adminViewMode, setAdminViewMode] = useState("table");
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [showAdminDetailsModal, setShowAdminDetailsModal] = useState(false);
  const [selectedAdminDetail, setSelectedAdminDetail] = useState(null);
  const [adminDetailLoading, setAdminDetailLoading] = useState(false);
  const [adminActivityLogs, setAdminActivityLogs] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "male",
    age: 35,
    role: "admin",
    status: "active",
    permissions: [],
  });

  // Candidates / Students State
  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentForm, setStudentForm] = useState({
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
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [editingCollege, setEditingCollege] = useState(null);
  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [collegeForm, setCollegeForm] = useState(INITIAL_COLLEGE_FORM);

  // Academic Catalog Data (Streams, Degrees, Courses, Specializations)
  const [catalogItems, setCatalogItems] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [showAddCatalogModal, setShowAddCatalogModal] = useState(false);
  const [editingCatalogItem, setEditingCatalogItem] = useState(null);
  const [catalogForm, setCatalogForm] = useState({
    name: "",
    code: "",
    durationYears: 5,
  });

  // Dedicated Schema-Compliant Modal States
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



  // Generic Delete Confirmation Modal State
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // ==========================================
  // API FETCH HANDLERS (READ)
  // ==========================================

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const res = await axios.get(`${API}/api/superadmin/dashboard`, getAuthHeaders());
      if (res.data.success) {
        setStats(res.data.stats || {});
        if (res.data.stats?.totalEmailTemplates !== undefined) {
          setTemplatesCount(res.data.stats.totalEmailTemplates);
        }
      }
    } catch (err) {
      console.error("Dashboard stats error:", err);
      showToast(err.response?.data?.message || "Failed to load dashboard metrics", "error");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setAdminLoading(true);
      const res = await axios.get(`${API}/api/superadmin/admins`, {
        ...getAuthHeaders(),
        params: {
          search: adminSearch,
          status: adminStatusFilter,
          role: adminRoleFilter,
          limit: 100,
        },
      });
      if (res.data.success) {
        setAdmins(res.data.data || []);
      }
    } catch (err) {
      console.error("Admins error:", err);
    } finally {
      setAdminLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setStudentLoading(true);
      const res = await axios.get(`${API}/getAllStudent`, getAuthHeaders());
      if (res.data.success) {
        setStudents(res.data.data || []);
      }
    } catch (err) {
      console.error("Students fetch error:", err);
    } finally {
      setStudentLoading(false);
    }
  };

  const fetchColleges = async () => {
    try {
      setCollegeLoading(true);
      const res = await axios.get(`${API}/getAllColleges`, getAuthHeaders());
      if (res.data.success) {
        setColleges(res.data.data || []);
      }
    } catch (err) {
      console.error("Colleges fetch error:", err);
    } finally {
      setCollegeLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      setUniversityLoading(true);
      const res = await axios.get(`${API}/getAllUniversities`, getAuthHeaders());
      if (res.data.success) {
        setUniversities(res.data.data || []);
      }
    } catch (err) {
      console.error("Universities fetch error:", err);
      showToast("Failed to load universities", "error");
    } finally {
      setUniversityLoading(false);
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
      console.error("Catalog error:", err);
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

  // Initial Data Fetch
  useEffect(() => {
    fetchDashboardStats();
    fetchStudents();
    fetchUniversities();
    fetchColleges();
    fetchAdmins();
    preloadCatalogReferences();
  }, []);

  // Fetch when activeTab changes
  useEffect(() => {
    if (activeTab === "admins") fetchAdmins();
    if (activeTab === "students") fetchStudents();
    if (activeTab === "universities") fetchUniversities();
    if (activeTab === "colleges") {
      fetchColleges();
      fetchUniversities();
    }
    if (["streams", "degrees", "courses", "specializations"].includes(activeTab)) {
      fetchCatalog(activeTab);
      preloadCatalogReferences();
    }
  }, [activeTab]);

  // ==========================================
  // FULL CRUD HANDLERS
  // ==========================================

  // --- CANDIDATE CRUD ---
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        // UPDATE: PUT /updateStudent/:id
        const res = await axios.put(`${API}/updateStudent/${editingStudent._id}`, studentForm, getAuthHeaders());
        if (res.data.success) {
          showToast("Candidate credentials updated successfully!", "success");
          setEditingStudent(null);
          setShowAddStudentModal(false);
          fetchStudents();
          fetchDashboardStats();
        }
      } else {
        // CREATE: POST /addStudent
        const res = await axios.post(`${API}/addStudent`, studentForm, getAuthHeaders());
        if (res.data.success) {
          showToast("Candidate enrolled successfully!", "success");
          setShowAddStudentModal(false);
          fetchStudents();
          fetchDashboardStats();
        }
      }
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
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleOpenEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name || "",
      email: student.email || "",
      gender: student.gender || "male",
      age: student.age || "19",
      phone: student.phone || "",
      category: student.category || "GEN",
      neetRollNumber: student.neetRollNumber || "",
      neetScore: student.neetScore || "",
      neetAllIndiaRank: student.neetAllIndiaRank || "",
    });
    setShowAddStudentModal(true);
  };

  const handleDeleteStudent = (student) => {
    setDeleteDialog({
      isOpen: true,
      title: "Delete Candidate Record",
      message: `Are you sure you want to remove candidate "${student.name}"? This action can be undone from trash.`,
      onConfirm: async () => {
        try {
          const res = await axios.delete(`${API}/deleteStudent/${student._id}`, getAuthHeaders());
          if (res.data.success) {
            showToast("Candidate removed from registry!", "success");
            setDeleteDialog({ isOpen: false, title: "", message: "", onConfirm: null });
            fetchStudents();
            fetchDashboardStats();
          }
        } catch (err) {
          showToast(err.response?.data?.message || "Failed to delete student", "error");
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
          status: status,
          remarks: status === "verified" ? "All credentials verified." : "Documents rejected. Resubmission required.",
        },
        getAuthHeaders()
      );
      if (res.data.success) {
        showToast(`Candidate credentials marked as ${status}!`, "success");
        setSelectedStudent(null);
        fetchStudents();
        fetchDashboardStats();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Verification failed", "error");
    }
  };

  // --- COLLEGE CRUD ---
  const handleSaveCollege = async (e) => {
    e.preventDefault();
    try {
      if (editingCollege) {
        // UPDATE: PUT /updateCollege/:id
        const res = await axios.put(`${API}/updateCollege/${editingCollege._id}`, collegeForm, getAuthHeaders());
        if (res.data.success) {
          showToast("Medical College updated successfully!", "success");
          setEditingCollege(null);
          setShowAddCollegeModal(false);
          fetchColleges();
          fetchDashboardStats();
        }
      } else {
        // CREATE: POST /addCollege
        const res = await axios.post(`${API}/addCollege`, collegeForm, getAuthHeaders());
        if (res.data.success) {
          showToast("Medical College added to national directory!", "success");
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
      collegeType: college.collegeType || "government",
      ownership: college.ownership || "State Government",
      establishedYear: college.establishedYear || 1985,
      description: college.description || "",
      address: college.location?.address || college.address || "",
      city: college.location?.city || college.city || "",
      state: college.location?.state || college.state || "",
      country: college.location?.country || college.country || "India",
      pincode: college.location?.pincode || college.pincode || "",
      email: college.contact?.email || college.email || "",
      phone: college.contact?.phone || college.phone || "",
      website: college.website || "",
      status: college.status || "active",
      isVerified: college.isVerified !== undefined ? Boolean(college.isVerified) : true,
    });
    setShowAddCollegeModal(true);
  };

  const handleDeleteCollege = (college) => {
    setDeleteDialog({
      isOpen: true,
      title: "Delete Medical College",
      message: `Are you sure you want to remove "${college.name}" from the national admissions directory?`,
      onConfirm: async () => {
        try {
          const res = await axios.delete(`${API}/deleteCollege/${college._id}`, getAuthHeaders());
          if (res.data.success) {
            showToast("College removed from directory!", "success");
            setDeleteDialog({ isOpen: false, title: "", message: "", onConfirm: null });
            fetchColleges();
            fetchDashboardStats();
          }
        } catch (err) {
          showToast(err.response?.data?.message || "Failed to delete college", "error");
        }
      },
    });
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
        address: uni.location?.address || uni.address || "",
        city: uni.location?.city || uni.city || "",
        state: uni.location?.state || uni.state || "Delhi",
        country: uni.location?.country || uni.country || "India",
        pincode: uni.location?.pincode || uni.pincode || "",
        coordinates: {
          latitude: uni.location?.coordinates?.latitude ?? "",
          longitude: uni.location?.coordinates?.longitude ?? "",
        },
      },
      contact: {
        email: uni.contact?.email || uni.email || "",
        phone: uni.contact?.phone || uni.phone || "",
      },
      website: uni.website || "",
      facilities: {
        hostel: uni.facilities?.hostel ?? true,
        hospital: uni.facilities?.hospital ?? true,
        library: uni.facilities?.library ?? true,
        sports: uni.facilities?.sports ?? true,
        cafeteria: uni.facilities?.cafeteria ?? true,
        transport: uni.facilities?.transport ?? true,
        wifi: uni.facilities?.wifi ?? true,
        auditorium: uni.facilities?.auditorium ?? true,
        campusArea: uni.facilities?.campusArea || uni.campusArea || "50 Acres",
      },
      status: uni.status || "active",
      isVerified: uni.isVerified !== undefined ? Boolean(uni.isVerified) : true,
    });
    setShowAddUniversityModal(true);
  };

  const handleDeleteUniversity = (uni) => {
    setDeleteDialog({
      isOpen: true,
      title: "Delete University",
      message: `Are you sure you want to remove "${uni.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await axios.delete(`${API}/deleteUniversity/${uni._id}`, getAuthHeaders());
          if (res.data.success) {
            showToast("University removed successfully!", "success");
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
          preloadCatalogReferences();
        }
      } else {
        const res = await axios.post(`${API}/addSpecialization`, payload, getAuthHeaders());
        if (res.data.success) {
          showToast("Clinical specialization created successfully!", "success");
          setShowSpecializationModal(false);
          fetchCatalog("specializations");
          preloadCatalogReferences();
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
        careerOptions: Array.isArray(item.careerOptions)
          ? item.careerOptions.join(", ")
          : "",
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
            showToast("Item removed from catalog!", "success");
            setDeleteDialog({ isOpen: false, title: "", message: "", onConfirm: null });
            fetchCatalog(activeTab);
            preloadCatalogReferences();
          }
        } catch (err) {
          showToast(err.response?.data?.message || "Delete failed", "error");
        }
      },
    });
  };



  // --- ADMIN PERSONNEL ACTIONS (CRUD) ---
  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.email || !adminForm.phone) {
      showToast("Please fill in all mandatory fields", "error");
      return;
    }
    if (!editingAdmin && (!adminForm.password || adminForm.password.length < 6)) {
      showToast("Initial password must be at least 6 characters", "error");
      return;
    }
    try {
      if (editingAdmin) {
        const res = await axios.put(`${API}/api/superadmin/admins/${editingAdmin._id}`, adminForm, getAuthHeaders());
        if (res.data.success) {
          showToast("Admin officer details updated successfully!", "success");
          setShowCreateAdminModal(false);
          setEditingAdmin(null);
          fetchAdmins();
        }
      } else {
        const res = await axios.post(`${API}/api/superadmin/admins`, adminForm, getAuthHeaders());
        if (res.data.success) {
          showToast("Admin officer account created successfully!", "success");
          setShowCreateAdminModal(false);
          setEditingAdmin(null);
          fetchAdmins();
          fetchDashboardStats();
        }
      }
      setAdminForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        status: "active",
        permissions: [],
      });
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleViewAdminDetails = async (admin) => {
    try {
      setSelectedAdminDetail(admin);
      setShowAdminDetailsModal(true);
      setAdminDetailLoading(true);
      const res = await axios.get(`${API}/api/superadmin/admins/${admin._id}`, getAuthHeaders());
      if (res.data?.success && res.data.data) {
        setSelectedAdminDetail(res.data.data);
        setAdminActivityLogs(res.data.activityLogs || []);
      }
    } catch (err) {
      console.error("View admin details error:", err);
    } finally {
      setAdminDetailLoading(false);
    }
  };

  const handleOpenEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setAdminForm({
      name: admin.name || "",
      email: admin.email || "",
      password: "",
      phone: admin.phone || "",
      gender: admin.gender || "male",
      age: admin.age || 35,
      role: admin.role || "admin",
      status: admin.status || "active",
      permissions: admin.permissions || [],
    });
    setShowCreateAdminModal(true);
  };

  const handleDeleteAdmin = (admin) => {
    setDeleteDialog({
      isOpen: true,
      title: "Delete Admin Officer Account",
      message: `Are you sure you want to permanently remove admin officer "${admin.name}" (${admin.email})?`,
      onConfirm: async () => {
        try {
          const res = await axios.delete(`${API}/api/superadmin/admins/${admin._id}`, getAuthHeaders());
          if (res.data.success) {
            showToast("Admin account removed successfully!", "success");
            setDeleteDialog({ isOpen: false, title: "", message: "", onConfirm: null });
            fetchAdmins();
            fetchDashboardStats();
          }
        } catch (err) {
          showToast(err.response?.data?.message || "Failed to delete admin", "error");
        }
      },
    });
  };

  const handleToggleAdminStatus = async (admin) => {
    const nextStatus = admin.status === "active" ? "inactive" : "active";
    try {
      const res = await axios.patch(
        `${API}/api/superadmin/admins/${admin._id}/status`,
        { status: nextStatus },
        getAuthHeaders()
      );
      if (res.data.success) {
        showToast(`Admin account marked as ${nextStatus}!`, "success");
        fetchAdmins();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Status update failed", "error");
    }
  };





  // Filtered Lists
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      (s.name || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
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
      (c.city || "").toLowerCase().includes(collegeSearch.toLowerCase()) ||
      (c.state || "").toLowerCase().includes(collegeSearch.toLowerCase());
    const matchesType =
      collegeTypeFilter === "all" || c.collegeType === collegeTypeFilter;
    return matchesSearch && matchesType;
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

  const filteredAdmins = admins.filter((a) => {
    const matchesSearch =
      (a.name || "").toLowerCase().includes(adminSearch.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(adminSearch.toLowerCase()) ||
      (a.phone || "").toLowerCase().includes(adminSearch.toLowerCase());
    const matchesStatus =
      adminStatusFilter === "all" || a.status === adminStatusFilter;
    const matchesRole =
      adminRoleFilter === "all" || a.role === adminRoleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // ==========================================
  // RENDER UI
  // ==========================================

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-semibold flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-4 duration-200 ${
            toast.type === "success"
              ? "bg-slate-900 border-emerald-500/50 text-emerald-300"
              : toast.type === "error"
              ? "bg-slate-900 border-rose-500/50 text-rose-300"
              : "bg-slate-900 border-indigo-500/50 text-indigo-300"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === "info" && <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, message: "", type: "success" })}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
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

      {/* Responsive Adjustable Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          totalStudents: stats.totalStudents,
          totalUniversities: universities.length,
          totalColleges: stats.totalColleges,
          totalAdmins: stats.totalAdmins,
          totalDegrees: (allDegrees || []).length,
          totalStreams: (allStreams || []).length,
          totalCourses: (allCourses || []).length || stats.totalCourses,
          totalSpecializations: (allSpecializations || []).length,
          activeRounds: stats.activeRounds,
          totalTemplates: templatesCount,
        }}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Breadcrumb & Status */}
        <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
            <span
              onClick={() => setActiveTab("overview")}
              className="hover:text-indigo-600 cursor-pointer font-medium transition"
            >
              Admissions Portal
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-bold capitalize">
              {activeTab === "admins"
                ? "Officer Personnel"
                : activeTab === "allotments"
                ? "Seat Allotments"
                : activeTab === "logs"
                ? "Audit Trail"
                : activeTab === "rounds"
                ? "Counselling Rounds"
                : activeTab === "email-templates"
                ? "Email Templates"
                : activeTab === "students"
                ? "Student Directory"
                : activeTab === "universities"
                ? "Universities"
                : activeTab === "colleges"
                ? "Colleges"
                : activeTab === "degrees"
                ? "Degrees Directory"
                : activeTab === "streams"
                ? "Streams Directory"
                : activeTab === "courses"
                ? "Courses Directory"
                : activeTab === "specializations"
                ? "Specializations Directory"
                : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchDashboardStats();
                if (activeTab === "students") fetchStudents();
                if (activeTab === "universities") fetchUniversities();
                if (activeTab === "colleges") fetchColleges();
                if (activeTab === "admins") fetchAdmins();
                if (["streams", "degrees", "courses", "specializations"].includes(activeTab)) {
                  fetchCatalog(activeTab);
                }
                showToast("Data synchronized from database", "success");
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition border border-slate-200 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live DB
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* ======================================================== */}
          {/* 1. OVERVIEW & ANALYTICS TAB */}
          {/* ======================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Directorate Hero Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admissions Directorate Command Center</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                    Super Admin Directorate
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    National NEET-UG merit allocation, institution governance, candidate verification, and accountable seat allotment operations.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-6">
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
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Enroll Candidate</span>
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
                      <span>Add Medical College</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs card-hover">
                  <div className="flex items-center justify-between text-slate-500 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider">Candidate Registry</span>
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight font-mono-numbers">
                    {stats.totalStudents || 0}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-emerald-600 font-bold">
                      {stats.totalStudents || 0} Enrolled
                    </span>
                    <span>active candidates in DB</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs card-hover">
                  <div className="flex items-center justify-between text-slate-500 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider">Colleges Onboarded</span>
                    <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight font-mono-numbers">
                    {stats.totalColleges || 0}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-sky-600 font-bold">{stats.totalUniversities || 0} Universities</span>
                    <span>• {stats.totalColleges || 0} Colleges</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs card-hover">
                  <div className="flex items-center justify-between text-slate-500 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider">Document Verification</span>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight font-mono-numbers">
                    {stats.verifiedApplications || 0}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-amber-600 font-bold">{stats.pendingApplications || 0} pending review</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs card-hover">
                  <div className="flex items-center justify-between text-slate-500 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider">Counselling Applications</span>
                    <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight font-mono-numbers">
                    {stats.totalApplications || 0}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-purple-600 font-bold">{stats.totalStreams || 0} Streams</span>
                    <span>• {stats.totalDegrees || 0} Degrees</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">National Directory Quick Access</h3>
                      <p className="text-xs text-slate-500">Inspect directories, manage institutions, and oversee candidates</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab("students")}
                      className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500/50 bg-slate-50 hover:bg-indigo-50/40 text-left transition group cursor-pointer"
                    >
                      <Users className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-sm font-bold text-slate-900">Candidates</div>
                      <div className="text-xs text-slate-500 mt-1">{stats.totalStudents || 0} Enrolled</div>
                    </button>

                    <button
                      onClick={() => setActiveTab("colleges")}
                      className="p-4 rounded-xl border border-slate-200 hover:border-sky-500/50 bg-slate-50 hover:bg-sky-50/40 text-left transition group cursor-pointer"
                    >
                      <Building2 className="w-6 h-6 text-sky-600 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-sm font-bold text-slate-900">Institutions</div>
                      <div className="text-xs text-slate-500 mt-1">{stats.totalColleges || 0} Registered</div>
                    </button>

                    <button
                      onClick={() => setActiveTab("admins")}
                      className="p-4 rounded-xl border border-slate-200 hover:border-purple-500/50 bg-slate-50 hover:bg-purple-50/40 text-left transition group cursor-pointer"
                    >
                      <ShieldCheck className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-sm font-bold text-slate-900">Officers</div>
                      <div className="text-xs text-slate-500 mt-1">{stats.totalAdmins || 0} Active Staff</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. CANDIDATE DIRECTORY TAB (FULL CRUD) */}
          {/* ======================================================== */}
          {activeTab === "students" && (
            <div className="space-y-4">
              {/* Controls Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[300px]">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search candidates by name, roll no, email..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      value={studentStatusFilter}
                      onChange={(e) => setStudentStatusFilter(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="verified">Verified Documents</option>
                      <option value="pending">Pending Verification</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setStudentViewMode("table")}
                      className={`p-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        studentViewMode === "table" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                      title="Table View"
                    >
                      <Table className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setStudentViewMode("card")}
                      className={`p-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        studentViewMode === "card" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                      title="Card View"
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
                    <span>Enroll Candidate</span>
                  </button>
                </div>
              </div>


              {/* Content View: Table or Cards */}
              {studentLoading ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2 text-indigo-500" />
                  Loading Candidate Directory...
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                  <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <div className="text-base font-bold text-slate-700">No Candidates Found</div>
                  <p className="text-sm text-slate-500 mt-1">Try adjusting your search criteria or enroll a new candidate.</p>
                </div>
              ) : studentViewMode === "table" ? (
                /* TABLE VIEW WITH EDIT AND DELETE */
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                          <th className="py-3.5 px-4">Candidate Name</th>
                          <th className="py-3.5 px-4">NEET Roll No</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Score & Rank</th>
                          <th className="py-3.5 px-4">Verification</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((student) => (
                          <tr key={student._id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{student.name}</div>
                              <div className="text-xs text-slate-500">{student.email}</div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                              {student.neetRollNumber || "â€”"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {student.category || "GEN"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-800">
                                {student.neetScore || "N/A"}
                              </div>
                              <div className="text-xs text-slate-500 font-mono">
                                AIR: #{student.neetAllIndiaRank || "â€”"}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              {student.isVerified ? (<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><Check className="w-3.5 h-3.5" /> Verified</span>) : (<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3.5 h-3.5" /> Pending</span>)}
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5">
                              <button
                                onClick={() => setSelectedStudent(student)}
                                className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition cursor-pointer"
                                title="Inspect & Verify"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEditStudent(student)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                title="Edit Candidate"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student)}
                                className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                title="Delete Candidate"
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
                /* CARD GRID VIEW WITH EDIT AND DELETE */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredStudents.map((student) => (
                    <div
                      key={student._id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs card-hover flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <h4 className="text-base font-bold text-slate-900">{student.name}</h4>
                            <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{student.email}</p>
                          </div>
                          {student.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                              <Check className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                              Pending
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-xs">
                          <div>
                            <span className="text-slate-400 block font-medium">NEET Roll</span>
                            <span className="font-mono font-bold text-slate-800 block truncate">
                              {student.neetRollNumber || "â€”"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Category</span>
                            <span className="font-bold text-slate-800">{student.category || "GEN"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">NEET Score</span>
                            <span className="font-bold text-indigo-600 text-sm">{student.neetScore || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">AIR Rank</span>
                            <span className="font-mono font-bold text-slate-800">#{student.neetAllIndiaRank || "â€”"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditStudent(student)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer"
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

          {/* ======================================================== */}
          {/* 2.5. UNIVERSITIES DIRECTORY TAB (FULL CRUD) */}
          {/* ======================================================== */}
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
              {universityLoading ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2 text-indigo-500" />
                  Loading Universities Directory...
                </div>
              ) : filteredUniversities.length === 0 ? (
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
                              onClick={() => setViewingItem({ item: uni, type: "universities" })}
                              className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
                              title="Inspect"
                            >
                              <Eye className="w-4 h-4" />
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

          {/* ======================================================== */}
          {/* 3. COLLEGE DIRECTORY TAB (FULL CRUD) */}
          {/* ======================================================== */}
          {activeTab === "colleges" && (
            <div className="space-y-4">
              {/* Controls Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[300px]">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search medical college, city, or state..."
                      value={collegeSearch}
                      onChange={(e) => setCollegeSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-400" />
                    <select
                      value={collegeTypeFilter}
                      onChange={(e) => setCollegeTypeFilter(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="all">All Institution Types</option>
                      <option value="government">Government Colleges</option>
                      <option value="private">Private Colleges</option>
                      <option value="deemed">Deemed Universities</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setCollegeViewMode("card")}
                      className={`p-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        collegeViewMode === "card" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                      title="Card View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCollegeViewMode("table")}
                      className={`p-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        collegeViewMode === "table" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                      title="Table View"
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

              {/* View Output */}
              {collegeLoading ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2 text-indigo-500" />
                  Loading College Directory...
                </div>
              ) : filteredColleges.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                  <Building2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <div className="text-base font-bold text-slate-700">No Colleges Found</div>
                </div>
              ) : collegeViewMode === "card" ? (
                /* CARDS WITH EDIT & DELETE */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredColleges.map((college) => (
                    <div
                      key={college._id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs card-hover flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider ${
                              college.collegeType === "government"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : college.collegeType === "deemed"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-sky-50 text-sky-700 border border-sky-200"
                            }`}
                          >
                            {college.collegeType}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Est. {college.establishedYear || "â€”"}</span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 leading-snug mb-1 mt-2">
                          {college.name}
                        </h4>
                        <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {college.location?.city || college.city || "â€”"},{" "}
                            {college.location?.state || college.state || "â€”"}
                          </span>
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-slate-400 text-xs truncate max-w-[140px] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{college.contact?.email || college.email || "No email"}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditCollege(college)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                            title="Edit College"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCollege(college)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                            title="Delete College"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* TABLE WITH EDIT & DELETE */
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                          <th className="py-3.5 px-4">College Name</th>
                          <th className="py-3.5 px-4">Type</th>
                          <th className="py-3.5 px-4">Location</th>
                          <th className="py-3.5 px-4">Established</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredColleges.map((college) => (
                          <tr key={college._id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4 font-bold text-slate-900">{college.name}</td>
                            <td className="py-3.5 px-4 capitalize font-semibold text-slate-700">
                              {college.collegeType}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              {college.location?.city || college.city || "â€”"},{" "}
                              {college.location?.state || college.state || "â€”"}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-700 font-medium">
                              {college.establishedYear || "â€”"}
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. ADMIN & OFFICER MANAGEMENT TAB */}
          {/* ======================================================== */}
          {activeTab === "admins" && (
            <div className="space-y-4">
              {/* Filter Toolbar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[300px]">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search officer by name, email, phone..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                  </div>

                  <select
                    value={adminRoleFilter}
                    onChange={(e) => setAdminRoleFilter(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Roles (Super & Officers)</option>
                    <option value="admin">Admin Officers</option>
                    <option value="superAdmin">Super Admins</option>
                  </select>

                  <select
                    value={adminStatusFilter}
                    onChange={(e) => setAdminStatusFilter(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Officers</option>
                    <option value="inactive">Suspended / Inactive</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Toggle: Table vs Card */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setAdminViewMode("table")}
                      className={`p-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        adminViewMode === "table"
                          ? "bg-white text-indigo-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                      title="Table View"
                    >
                      <Table className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setAdminViewMode("card")}
                      className={`p-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        adminViewMode === "card"
                          ? "bg-white text-indigo-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                      title="Card View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setEditingAdmin(null);
                      setAdminForm({
                        name: "",
                        email: "",
                        password: "",
                        phone: "",
                        gender: "male",
                        age: 35,
                        role: "admin",
                        status: "active",
                        permissions: [],
                      });
                      setShowCreateAdminModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-xs transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Provision Admin Account</span>
                  </button>
                </div>
              </div>

              {adminLoading ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2 text-indigo-500" />
                  Loading Personnel Accounts...
                </div>
              ) : filteredAdmins.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                  <ShieldCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <div className="text-base font-bold text-slate-700">No Admin Accounts Found</div>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or role filters</p>
                </div>
              ) : adminViewMode === "card" ? (
                /* ATTRACTIVE ADMIN CARDS GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredAdmins.map((admin) => (
                    <div
                      key={admin._id}
                      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                    >
                      {/* Top Accent Gradient Bar */}
                      <div
                        className={`h-2.5 w-full bg-gradient-to-r ${
                          admin.role === "superAdmin"
                            ? "from-purple-600 via-indigo-600 to-slate-900"
                            : "from-sky-500 via-indigo-500 to-purple-600"
                        }`}
                      />

                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Role & Status Pills Row */}
                          <div className="flex items-center justify-between gap-2 mb-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 ${
                                admin.role === "superAdmin"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : "bg-sky-50 text-sky-700 border border-sky-200"
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3" />
                              {admin.role === "superAdmin" ? "Super Admin" : "Admin Officer"}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                admin.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  admin.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                                }`}
                              />
                              {admin.status === "active" ? "Active" : "Suspended"}
                            </span>
                          </div>

                          {/* Avatar & Officer Details */}
                          <div className="flex items-start gap-3.5 mb-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0 tracking-wider">
                              {admin.name
                                ? admin.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()
                                : "AD"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-[15px] font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug truncate">
                                {admin.name}
                              </h4>
                              <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{admin.email}</span>
                              </p>
                            </div>
                          </div>

                          {/* Quick Officer Meta Strip */}
                          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" /> Phone:
                              </span>
                              <span className="font-mono font-semibold text-slate-800">
                                {admin.phone || "â€”"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Authority Scope:</span>
                              <span className="font-bold text-indigo-600 inline-flex items-center gap-1">
                                <Check className="w-3 h-3 text-indigo-500" />
                                {admin.permissions?.length || 0} Permissions Granted
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleViewAdminDetails(admin)}
                            className="flex-1 py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1"
                            title="Inspect Admin Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditAdmin(admin)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                            title="Edit Admin Officer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleAdminStatus(admin)}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                              admin.status === "active"
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                            title={admin.status === "active" ? "Suspend Officer" : "Activate Officer"}
                          >
                            {admin.status === "active" ? "Suspend" : "Activate"}
                          </button>



                          <button
                            onClick={() => handleDeleteAdmin(admin)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                            title="Delete Admin Officer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* TABLE VIEW WITH INSPECT / GET ONE ACTION */
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                          <th className="py-3.5 px-4">Officer Details</th>
                          <th className="py-3.5 px-4">Phone</th>
                          <th className="py-3.5 px-4">Role</th>
                          <th className="py-3.5 px-4">Authority Scope</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAdmins.map((admin) => (
                          <tr key={admin._id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                                  {admin.name
                                    ? admin.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .slice(0, 2)
                                        .join("")
                                        .toUpperCase()
                                    : "AD"}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">{admin.name}</div>
                                  <div className="text-xs text-slate-500">{admin.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-700 font-medium">
                              {admin.phone || "â€”"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                  admin.role === "superAdmin"
                                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                                    : "bg-sky-50 text-sky-700 border border-sky-200"
                                }`}
                              >
                                {admin.role === "superAdmin" ? "Super Admin" : "Admin"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                <ShieldCheck className="w-3 h-3 text-indigo-500" />
                                {admin.permissions?.length || 0} permissions
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                  admin.status === "active"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {admin.status === "active" ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <X className="w-3.5 h-3.5" />
                                )}
                                {admin.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5">
                              {/* Inspect / View Details Button */}
                              <button
                                onClick={() => handleViewAdminDetails(admin)}
                                className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition cursor-pointer"
                                title="Inspect & View Full Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEditAdmin(admin)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                title="Edit Admin Officer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleAdminStatus(admin)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  admin.status === "active"
                                    ? "bg-amber-50 hover:bg-amber-100 text-amber-700"
                                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {admin.status === "active" ? "Deactivate" : "Activate"}
                              </button>

                              <button
                                onClick={() => handleDeleteAdmin(admin)}
                                className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                title="Delete Admin Officer"
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
              )}
            </div>
          )}


          {/* ======================================================== */}
          {/* 5. ACADEMIC CATALOG DIRECTORIES (FULL CRUD) */}
          {/* ======================================================== */}





          {/* ======================================================== */}
          {/* 7. ACADEMIC CATALOG DIRECTORIES (FULL CRUD) */}
          {/* ======================================================== */}
          {["streams", "degrees", "courses", "specializations"].includes(activeTab) && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 capitalize">
                    {activeTab} Directory
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    National curriculum directory and approved medical seats catalog
                  </p>
                </div>
                <button
                  onClick={handleOpenAddCatalogItem}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span className="capitalize">Add {activeTab.slice(0, -1)}</span>
                </button>
              </div>

              {catalogLoading ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2 text-indigo-500" />
                  Loading Academic Catalog...
                </div>
              ) : catalogItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                  <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <div className="text-base font-bold text-slate-700">No Records Found</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {catalogItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs card-hover flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-1">{item.name}</h4>
                        <p className="text-xs sm:text-sm text-slate-500">{item.code || item.slug || "Active"}</p>
                        {item.durationYears && (
                          <div className="mt-3 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            Course Duration: {item.durationYears} Years
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingItem({ item, type: activeTab })}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition cursor-pointer"
                          title={`Inspect ${activeTab.slice(0, -1)}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditCatalogItem(item)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCatalogItem(item)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
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







          {/* ======================================================== */}
          {/* 10. EMAIL TEMPLATES TAB */}
          {/* ======================================================== */}
          {activeTab === "email-templates" && (
            <EmailTemplatesTab
              onTemplatesUpdated={(count) => setTemplatesCount(count)}
            />
          )}

          {/* ======================================================== */}
          {/* 11. APPLICATIONS TAB */}
          {/* ======================================================== */}
          {activeTab === "applications" && (
            <ApplicationsTab showToast={showToast} />
          )}

          {/* ======================================================== */}
          {/* 12. ROLES & PERMISSIONS TAB */}
          {/* ======================================================== */}
          {activeTab === "roles" && (
            <RolesTab showToast={showToast} />
          )}


        </div>
      </main>

      {/* ======================================================== */}
      {/* MODALS SECTION (Model Views) */}
      {/* ======================================================== */}

      {/* 1. Complete Candidate Dossier & Verification Modal */}
      {selectedStudent && (
        <ItemDetailsModal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          item={selectedStudent}
          type="students"
          onEdit={(student) => {
            setSelectedStudent(null);
            handleOpenEditStudent(student);
          }}
          onDelete={(student) => {
            setSelectedStudent(null);
            handleDeleteStudent(student);
          }}
          onVerify={(student, status) => {
            handleVerifyCandidate(student._id, status);
            setSelectedStudent(null);
          }}
        />
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

      {/* 2. Candidate Add / Edit Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? "Edit Candidate Details" : "Enroll New Candidate"}
              </h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Candidate Full Name"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Category</label>
                  <select
                    value={studentForm.category}
                    onChange={(e) => setStudentForm({ ...studentForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="GEN">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">NEET Score</label>
                  <input
                    type="number"
                    placeholder="650"
                    value={studentForm.neetScore}
                    onChange={(e) => setStudentForm({ ...studentForm, neetScore: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium font-mono"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    NEET UG score out of 720
                  </span>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">AIR Rank</label>
                  <input
                    type="number"
                    placeholder="1200"
                    value={studentForm.neetAllIndiaRank}
                    onChange={(e) => setStudentForm({ ...studentForm, neetAllIndiaRank: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">NEET Roll Number</label>
                <input
                  type="text"
                  placeholder="2404100123"
                  value={studentForm.neetRollNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, neetRollNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-xs transition cursor-pointer"
                >
                  {editingStudent ? "Update Candidate" : "Save & Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* 4. Academic Catalog Add / Edit Modal */}
      {showAddCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 capitalize">
                {editingCatalogItem ? `Edit ${activeTab.slice(0, -1)}` : `Add ${activeTab.slice(0, -1)}`}
              </h3>
              <button
                onClick={() => setShowAddCatalogModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCatalogItem} className="space-y-4 text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS, Dental Surgery, Pediatrics..."
                  value={catalogForm.name}
                  onChange={(e) => setCatalogForm({ ...catalogForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Code / Slug</label>
                <input
                  type="text"
                  placeholder="e.g. MBBS-01"
                  value={catalogForm.code}
                  onChange={(e) => setCatalogForm({ ...catalogForm, code: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Duration (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={catalogForm.durationYears}
                  onChange={(e) => setCatalogForm({ ...catalogForm, durationYears: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCatalogModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-xs transition cursor-pointer"
                >
                  {editingCatalogItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Provision / Edit Admin Modal */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingAdmin ? "Edit Admin Officer Details" : "Provision Admin Officer Account"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateAdminModal(false);
                  setEditingAdmin(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-4 text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Officer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Rajesh Verma"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="officer@medcounsel.org"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9988776655"
                    value={adminForm.phone}
                    onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Role</label>
                  <select
                    value={adminForm.role || "admin"}
                    onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium text-xs"
                  >
                    <option value="admin">Admin Officer</option>
                    <option value="superAdmin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Gender</label>
                  <select
                    value={adminForm.gender || "male"}
                    onChange={(e) => setAdminForm({ ...adminForm, gender: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium text-xs"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Status</label>
                  <select
                    value={adminForm.status || "active"}
                    onChange={(e) => setAdminForm({ ...adminForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium text-xs"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">
                  {editingAdmin ? "Update Password (Optional)" : "Initial Password *"}
                </label>
                <input
                  type="password"
                  required={!editingAdmin}
                  placeholder={editingAdmin ? "Leave blank to keep current password" : "Min 6 characters"}
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                    Assigned Permissions ({adminForm.permissions.includes("*") ? "All Operational (*)" : `${adminForm.permissions.length} selected`})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const allOpIds = PERMISSION_OPTIONS.map((p) => p.id);
                      const isAllOrWildcard =
                        adminForm.permissions.includes("*") ||
                        allOpIds.every((id) => adminForm.permissions.includes(id));
                      if (isAllOrWildcard) {
                        setAdminForm({ ...adminForm, permissions: [] });
                      } else {
                        // '*' gives all operational permissions (SuperAdmin access strictly excluded)
                        setAdminForm({ ...adminForm, permissions: ["*", ...allOpIds] });
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition border border-indigo-200 cursor-pointer"
                    title="Click * to grant all operational permissions (excludes SuperAdmin)"
                  >
                    <span className="font-mono text-sm leading-none font-black text-indigo-600">*</span>
                    <span>
                      {adminForm.permissions.includes("*") ||
                      PERMISSION_OPTIONS.map((p) => p.id).every((id) =>
                        adminForm.permissions.includes(id)
                      )
                        ? "Deselect All (*)"
                        : "Select All (*) • Operational Only"}
                    </span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 mb-2.5 flex items-center gap-1.5 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                  <span className="font-black text-indigo-600 font-mono text-sm leading-none">*</span>
                  <span className="text-slate-600 font-medium">
                    Grants all operational permissions (Candidates, Colleges, Academics, Applications, Emails). <strong>SuperAdmin governance is strictly excluded.</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  {PERMISSION_OPTIONS.map((perm) => {
                    const isChecked =
                      adminForm.permissions.includes("*") ||
                      adminForm.permissions.includes(perm.id);
                    return (
                      <label key={perm.id} className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-indigo-600">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let updated;
                            if (e.target.checked) {
                              updated = [...adminForm.permissions.filter((p) => p !== "*"), perm.id];
                            } else {
                              updated = adminForm.permissions.filter((p) => p !== perm.id && p !== "*");
                            }
                            setAdminForm({ ...adminForm, permissions: updated });
                          }}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="truncate" title={`${perm.label} (${perm.category})`}>
                          {perm.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateAdminModal(false);
                    setEditingAdmin(null);
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-xs transition cursor-pointer"
                >
                  {editingAdmin ? "Update Officer Account" : "Create Officer Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* 6.5. View Admin Details Modal (GET ONE & INSPECT DETAILS) */}
      {showAdminDetailsModal && selectedAdminDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Header Banner */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-800 text-white font-black text-xl flex items-center justify-center shadow-md tracking-wider">
                  {selectedAdminDetail.name
                    ? selectedAdminDetail.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "AD"}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      {selectedAdminDetail.name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                        selectedAdminDetail.role === "superAdmin"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-sky-100 text-sky-800 border border-sky-200"
                      }`}
                    >
                      {selectedAdminDetail.role === "superAdmin" ? "Super Admin" : "Admin Officer"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedAdminDetail.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          selectedAdminDetail.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                      {selectedAdminDetail.status === "active" ? "Active Account" : "Suspended"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedAdminDetail.email}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowAdminDetailsModal(false);
                  setSelectedAdminDetail(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Officer Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Official Phone</span>
                <span className="font-mono font-bold text-slate-800 text-sm block mt-0.5">
                  {selectedAdminDetail.phone || "â€”"}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Gender / Age</span>
                <span className="font-bold text-slate-800 capitalize text-sm block mt-0.5">
                  {selectedAdminDetail.gender || "Not specified"} ({selectedAdminDetail.age || 35} yrs)
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Created On</span>
                <span className="font-medium text-slate-700 block mt-0.5">
                  {selectedAdminDetail.createdAt
                    ? new Date(selectedAdminDetail.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "â€”"}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Authorized By</span>
                <span className="font-medium text-slate-700 block mt-0.5 truncate">
                  {selectedAdminDetail.createdBy?.name || selectedAdminDetail.createdBy?.email || "System Root SuperAdmin"}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Account ID</span>
                <span className="font-mono text-slate-600 block mt-0.5 truncate text-[11px]">
                  {selectedAdminDetail._id}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Identity Verified</span>
                <span className="font-bold text-emerald-700 inline-flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Government Officer
                </span>
              </div>
            </div>

            {/* System Permissions Matrix */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Assigned System Permissions ({selectedAdminDetail.permissions?.length || 0})</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  {selectedAdminDetail.role === "superAdmin" ? "Full Root Access" : "Role Restricted"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 max-h-48 overflow-y-auto">
                {PERMISSION_OPTIONS.map((perm) => {
                  const hasWildcard = (selectedAdminDetail.permissions || []).includes("*");
                  const hasPerm = hasWildcard || (selectedAdminDetail.permissions || []).includes(perm.id);
                  return (
                    <div
                      key={perm.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition ${
                        hasPerm
                          ? "bg-indigo-50/80 text-indigo-900 border border-indigo-200/60 font-semibold"
                          : "bg-white/60 text-slate-400 border border-slate-100 opacity-60"
                      }`}
                    >
                      {hasPerm ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span className="truncate">{perm.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Audit Activity Trail */}

            {/* Modal Actions Footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminDetailsModal(false);
                    handleOpenEditAdmin(selectedAdminDetail);
                  }}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Officer Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleToggleAdminStatus(selectedAdminDetail);
                    setSelectedAdminDetail({
                      ...selectedAdminDetail,
                      status: selectedAdminDetail.status === "active" ? "inactive" : "active",
                    });
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedAdminDetail.status === "active"
                      ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {selectedAdminDetail.status === "active" ? "Deactivate Account" : "Activate Account"}
                </button>

              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAdminDetailsModal(false);
                  setSelectedAdminDetail(null);
                }}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuperAdminDashboard;

