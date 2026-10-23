import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AlertModal from "./AlertModal";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: sessionStorage.getItem("resetEmail") || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Popup Alert Modal State
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const showAlert = (message, type = "", onConfirm = null) => {
    const text = String(message || "");
    let alertType = type;
    let alertTitle = "Notification";

    if (!alertType) {
      const lower = text.toLowerCase();
      if (lower.includes("success") || lower.includes("updated")) {
        alertType = "success";
        alertTitle = "Success";
      } else if (
        lower.includes("error") ||
        lower.includes("failed") ||
        lower.includes("not match") ||
        lower.includes("fill") ||
        lower.includes("least")
      ) {
        alertType = "error";
        alertTitle = "Action Required";
      } else {
        alertType = "info";
      }
    } else {
      if (alertType === "success") alertTitle = "Success";
      else if (alertType === "error") alertTitle = "Error";
    }

    setAlertModal({
      isOpen: true,
      title: alertTitle,
      message: text,
      type: alertType,
      onConfirm: onConfirm,
    });
  };

  const closeAlert = () => {
    setAlertModal({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
      onConfirm: null,
    });
  };

  const alert = (message, type, onConfirm) => showAlert(message, type, onConfirm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.newPassword || !formData.confirmPassword) {
      return alert("Please fill in all fields");
    }

    if (formData.newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:5000/reset", {
        email: formData.email.trim().toLowerCase(),
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        sessionStorage.removeItem("resetEmail");
        showAlert(response.data.message || "Password updated successfully", "success", () => {
          navigate("/login");
        });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Enter your new password below
        </p>

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter registered email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              placeholder="Minimum 6 characters"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-pink-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onConfirm={alertModal.onConfirm}
      />
    </div>
  );
};

export default ResetPassword;
