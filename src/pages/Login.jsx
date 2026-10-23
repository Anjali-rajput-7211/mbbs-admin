import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Info
} from "lucide-react";

const API = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // If already logged in, automatically redirect based on role
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedAdmin = JSON.parse(localStorage.getItem("admin") || "{}");
    if (token && storedAdmin.role) {
      if (storedAdmin.role === "superAdmin") {
        navigate("/superadmin", { replace: true });
      } else if (storedAdmin.role === "admin") {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSuccess = (token, user, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("admin", JSON.stringify(user));

    // Automatically route to the correct dashboard based on database role
    if (role === "superAdmin") {
      navigate("/superadmin");
    } else if (role === "admin") {
      navigate("/dashboard");
    } else {
      setErrorMsg("Access Denied: This portal is for administrative personnel only.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.email || !formData.password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const cleanEmail = formData.email.trim().toLowerCase();
      let response;

      // Primary canonical auth endpoint with fallback
      try {
        response = await axios.post(`${API}/api/auth/login`, {
          email: cleanEmail,
          password: formData.password,
        });
      } catch (primaryErr) {
        if (primaryErr.response?.status === 404) {
          response = await axios.post(`${API}/login`, {
            email: cleanEmail,
            password: formData.password,
          });
        } else {
          throw primaryErr;
        }
      }

      if (response.data.token) {
        const user = response.data.user || response.data.data || {};
        const role = response.data.role || user.role;

        // Check if role is admin or superAdmin
        if (role !== "admin" && role !== "superAdmin") {
          setErrorMsg(
            "Access Denied: Only Super Admins and Admins can access this portal. Candidates should sign in via the student portal."
          );
          return;
        }

        // Complete login and redirect to appropriate dashboard
        handleLoginSuccess(response.data.token, user, role);
      }
    } catch (error) {
      console.error("Login attempt error:", error);
      let message = error.response?.data?.message;
      if (!message) {
        if (!error.response) {
          message = "Cannot connect to server at " + API + ". Please ensure the backend server is running.";
        } else {
          message = "Authentication failed. Please verify your credentials.";
        }
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Administrator Sign In
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Sign in with your email and password. Your role will be verified automatically.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-2xl font-medium flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Single Unified Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your registered email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgetPassword"
                className="text-xs text-sky-400 font-bold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-sky-600/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Verifying Credentials & Role...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Informational Note */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <span>
            Single administrative portal: Enter your credentials. Super Admins and Counselling Admins will be routed to their respective dashboards automatically.
          </span>
        </div>

        <div className="pt-1 text-center">
          <p className="text-[11px] text-slate-500">
            Student Aspirant?{" "}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:underline font-bold"
            >
              Open Candidate Portal &rarr;
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
