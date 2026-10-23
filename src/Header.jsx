import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  ShieldCheck,
  Crown,
  Bell,
  LogOut,
  ChevronDown,
  User,
  Activity,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide header on authentication pages
  const isAuthPage = [
    "/login",
    "/forgetPassword",
    "/forget-password",
    "/resetPassword",
    "/reset-password",
  ].includes(location.pathname);

  if (isAuthPage || !token) {
    return null;
  }

  const isSuperAdmin = admin.role === "superAdmin";
  const userInitial = admin.name ? admin.name.charAt(0).toUpperCase() : (isSuperAdmin ? "S" : "A");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const handleToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-admin-sidebar"));
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm select-none">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={handleToggleSidebar}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          aria-label="Toggle Navigation Menu"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          to={isSuperAdmin ? "/superadmin" : "/dashboard"}
          className="flex items-center gap-3 group"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md transition-transform group-hover:scale-105 ${
              isSuperAdmin
                ? "bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-purple-600/30"
                : "bg-gradient-to-tr from-indigo-600 to-sky-500 shadow-indigo-600/30"
            }`}
          >
            {isSuperAdmin ? <Crown className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Med<span className={isSuperAdmin ? "text-purple-400" : "text-indigo-400"}>Counsel</span>
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                Admissions
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden md:block">
              National MBBS Admissions Directorate
            </p>
          </div>
        </Link>
      </div>

      {/* Right: Operational Status, Alerts & Profile */}
      <div className="flex items-center gap-3 sm:gap-4" ref={dropdownRef}>
        {/* Live System Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse" />
          <span>AY 2026–27 Live Cycle</span>
        </div>

        {/* Quick Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Operational Alerts
                </span>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                  System Live
                </span>
              </div>
              <div className="py-2 divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Seat Allocation Engine Ready</span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    All rules for Round 1 AIQ quota are calibrated and ready for processing.
                  </p>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs mb-1">
                    <Activity className="w-4 h-4 shrink-0" />
                    <span>Real-time Document Verification</span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Verification officers are actively validating student caste certificates.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 pl-3 sm:pr-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition cursor-pointer text-left"
          >
            <div className="hidden sm:block text-right">
              <div className="text-sm font-bold text-white truncate max-w-[140px]">
                {admin.name || "Administrator"}
              </div>
              <div className="text-xs text-slate-400 font-medium capitalize">
                {isSuperAdmin ? "Super Admin" : "Admissions Desk"}
              </div>
            </div>

            <div
              className={`w-8 h-8 rounded-lg text-white font-black text-sm flex items-center justify-center shrink-0 ${
                isSuperAdmin
                  ? "bg-purple-600 shadow-sm shadow-purple-600/50"
                  : "bg-indigo-600 shadow-sm shadow-indigo-600/50"
              }`}
            >
              {userInitial}
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-68 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-3 bg-slate-50 rounded-xl mb-1.5 border border-slate-100">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {admin.name || "Administrator"}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">
                  {admin.email || "admissions@medcounsel.org"}
                </div>
                <div className="mt-2 inline-block">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      isSuperAdmin
                        ? "bg-purple-100 text-purple-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {admin.role || "Authority"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                {isSuperAdmin && (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/dashboard");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition text-left cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>View Regular Admin Desk</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
