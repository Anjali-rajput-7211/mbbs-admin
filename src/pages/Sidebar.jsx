import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  LogOut,
  ChevronRight,
  Database,
  X,
  Sparkles,
  ChevronsLeft,
  ChevronsRight,
  Radio,
  HelpCircle,
  Mail,
  Landmark,
} from "lucide-react";

const DEFAULT_WIDTH = 270;
const MIN_WIDTH = 210;
const MAX_WIDTH = 420;
const COLLAPSED_WIDTH = 76;

const Sidebar = ({ activeTab, setActiveTab, counts = {} }) => {
  const navigate = useNavigate();

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Persistent collapsed and width state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = parseInt(localStorage.getItem("admin_sidebar_width"), 10);
      return !isNaN(saved) && saved >= MIN_WIDTH && saved <= MAX_WIDTH ? saved : DEFAULT_WIDTH;
    } catch {
      return DEFAULT_WIDTH;
    }
  });

  const [isResizing, setIsResizing] = useState(false);
  const isResizingRef = useRef(false);

  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const isSuperAdmin = admin.role === "superAdmin";

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem("admin_sidebar_collapsed", isCollapsed ? "true" : "false");
    } catch {}
  }, [isCollapsed]);

  useEffect(() => {
    try {
      if (!isCollapsed) {
        localStorage.setItem("admin_sidebar_width", sidebarWidth.toString());
      }
    } catch {}
  }, [sidebarWidth, isCollapsed]);

  // Keyboard shortcut: Ctrl + B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for mobile sidebar toggle from Header
  useEffect(() => {
    const handleToggle = () => {
      if (window.innerWidth < 1024) {
        setMobileOpen((prev) => !prev);
      } else {
        setIsCollapsed((prev) => !prev);
      }
    };
    const handleClose = () => setMobileOpen(false);

    window.addEventListener("toggle-admin-sidebar", handleToggle);
    window.addEventListener("close-admin-sidebar", handleClose);

    return () => {
      window.removeEventListener("toggle-admin-sidebar", handleToggle);
      window.removeEventListener("close-admin-sidebar", handleClose);
    };
  }, []);

  // Mouse Drag Resizing Logic
  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
    isResizingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (moveEvent) => {
      if (!isResizingRef.current) return;
      const newWidth = moveEvent.clientX;

      if (newWidth < 140) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
        const clampedWidth = Math.min(Math.max(newWidth, MIN_WIDTH), MAX_WIDTH);
        setSidebarWidth(clampedWidth);
      }
    };

    const onMouseUp = () => {
      isResizingRef.current = false;
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleSelectTab = (tabId) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    }
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  // Permission checking helper: SuperAdmin has full access; Admin requires granular permission
  const hasPerm = (permId) => {
    if (isSuperAdmin) return true;
    if (!permId) return true;

    // SuperAdmin governance and role management tabs can NEVER be accessed by an admin, even with '*'
    const superAdminOnlyPerms = ["view_roles", "create_roles", "edit_roles", "delete_roles"];
    if (superAdminOnlyPerms.includes(permId)) {
      return false;
    }

    const userPerms = Array.isArray(admin.permissions) ? admin.permissions : [];
    // Wildcard '*' gives all non-superadmin operational permissions
    if (userPerms.includes("*")) {
      return true;
    }

    const aliases = [permId];
    if (permId.startsWith("view_")) {
      aliases.push(permId.replace("view_", "manage_"));
    }
    return aliases.some((p) => userPerms.includes(p));
  };

  const rawSections = [
    {
      title: "Core Operations",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "applications", label: "Applications", icon: Award, permission: "view_applications", badge: counts.totalApplications },
        { id: "students", label: "Student Directory", icon: Users, permission: "view_students", badge: counts.totalStudents },
      ],
    },
    {
      title: "Academic Management",
      items: [
        { id: "universities", label: "Universities", icon: Landmark, permission: "view_universities", badge: counts.totalUniversities },
        { id: "colleges", label: "Colleges", icon: Building2, permission: "view_colleges", badge: counts.totalColleges },
        { id: "courses", label: "Courses / Degrees", icon: BookOpen, permission: "view_courses", badge: (counts.totalCourses || 0) + (counts.totalDegrees || 0) },
        { id: "streams", label: "Streams", icon: GraduationCap, permission: "view_streams", badge: counts.totalStreams },
        { id: "specializations", label: "Specializations", icon: Stethoscope, permission: "view_specializations", badge: counts.totalSpecializations },
      ],
    },
    {
      title: "Communications",
      items: [
        { id: "email-templates", label: "Email Templates", icon: Mail, permission: "view_email_templates", badge: counts.totalTemplates },
      ],
    },
    {
      title: "Governance & Access",
      items: [
        { id: "roles", label: "Roles & Permissions", icon: ShieldCheck, permission: "view_roles", badge: counts.totalRoles },
        { id: "admins", label: "Users & Staff", icon: Users, permission: "view_roles", badge: counts.totalAdmins },
      ],
    },
  ];

  // Filter sections and items based on logged-in user's permissions
  const navSections = rawSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => hasPerm(item.permission)),
    }))
    .filter((section) => section.items.length > 0);

  const currentWidth = isCollapsed ? COLLAPSED_WIDTH : sidebarWidth;

  const renderContent = (collapsed = false) => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 select-none relative overflow-hidden">
      {/* Directorate Header */}
      <div
        className={`border-b border-slate-800 flex items-center justify-between shrink-0 transition-all duration-200 ${
          collapsed ? "p-4 justify-center" : "p-4 sm:p-5"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>

          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <div className="text-xs font-extrabold tracking-wider uppercase text-indigo-400 truncate">
                {isSuperAdmin ? "Super Admin" : "Admissions Desk"}
              </div>
              <h2 className="text-sm font-bold text-white tracking-tight truncate">
                MedCounsel Directorate
              </h2>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button (Desktop) */}
        {!collapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
            title="Collapse Sidebar (Ctrl + B)"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* When Collapsed on Desktop: Expand Toggle Button */}
      {collapsed && (
        <div className="hidden lg:flex justify-center py-2.5 border-b border-slate-800/80">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition cursor-pointer"
            title="Expand Sidebar (Ctrl + B)"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Sections */}
      <div className={`flex-1 overflow-y-auto space-y-6 ${collapsed ? "px-2.5 py-4" : "px-3.5 py-5"}`}>
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            {!collapsed && (
              <div className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
                {section.title}
              </div>
            )}
            {collapsed && <div className="h-px bg-slate-800 my-2 mx-1" />}

            <div className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                        collapsed
                          ? "justify-center p-3"
                          : "gap-3.5 px-3.5 py-2.5"
                      } ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                        }`}
                      />

                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>

                          {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                isActive
                                  ? "bg-indigo-700/90 text-white"
                                  : "bg-slate-800 text-slate-300 group-hover:text-white"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}

                          {isActive && <ChevronRight className="w-4 h-4 shrink-0 opacity-80" />}
                        </>
                      )}
                    </button>

                    {/* Floating Tooltip in Collapsed Mode */}
                    {collapsed && (
                      <div className="hidden lg:group-hover:flex items-center gap-2 absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-2xl border border-slate-700 whitespace-nowrap z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        <span>{item.label}</span>
                        {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                          <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile & Logout */}
      <div className={`border-t border-slate-800 bg-slate-950/60 ${collapsed ? "p-3" : "p-4"}`}>
        {!collapsed ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-100 truncate">
                  {admin.name || "Administrator"}
                </div>
                <div className="text-xs text-slate-400 capitalize truncate flex items-center gap-1.5 mt-0.5">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  <span>{admin.role || "Authority"} • Online</span>
                </div>
              </div>
              <Database className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition border border-transparent hover:border-rose-500/20 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 text-sm font-bold shadow-sm"
              title={`${admin.name || "Administrator"} (${admin.role || "Authority"})`}
            >
              {(admin.name || "A").charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Interactive Draggable Resize Border (Desktop only) */}
      <div
        onMouseDown={startResizing}
        onDoubleClick={() => {
          setSidebarWidth(DEFAULT_WIDTH);
          setIsCollapsed(false);
        }}
        className={`hidden lg:block absolute top-0 right-0 w-2.5 h-full cursor-col-resize hover:bg-indigo-500/40 transition-colors z-40 group ${
          isResizing ? "bg-indigo-500 w-1.5" : ""
        }`}
        title="Click & drag to resize sidebar. Double-click to reset."
      >
        <div className="absolute top-1/2 -translate-y-1/2 right-0.5 w-1 h-8 rounded-full bg-slate-700/60 group-hover:bg-indigo-400 transition-colors" />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent & Adjustable Sidebar */}
      <aside
        style={{ width: `${currentWidth}px` }}
        className={`hidden lg:block h-[calc(100vh-64px)] sticky top-16 border-r border-slate-200/80 shrink-0 z-30 transition-[width] ${
          isResizing ? "duration-0" : "duration-200"
        }`}
      >
        {renderContent(isCollapsed)}
      </aside>

      {/* Mobile / Tablet Drawer with Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />
          <div className="relative w-76 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {renderContent(false)}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
