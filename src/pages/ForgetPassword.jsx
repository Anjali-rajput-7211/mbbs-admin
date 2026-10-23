import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AlertModal from "./AlertModal";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
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
      if (lower.includes("success") || lower.includes("verified") || lower.includes("sent")) {
        alertType = "success";
        alertTitle = "Success";
      } else if (
        lower.includes("error") ||
        lower.includes("failed") ||
        lower.includes("invalid") ||
        lower.includes("enter") ||
        lower.includes("wrong")
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

  const handleForget = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const cleanEmail = email.trim().toLowerCase();

      const response = await axios.post("http://localhost:5000/forget", {
        email: cleanEmail,
      });

      alert(response.data.message);

      setShowOtp(true);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      const cleanEmail = email.trim().toLowerCase();

      const response = await axios.post("http://localhost:5000/verify-otp", {
        email: cleanEmail,
        otp: otp.trim(),
      });

      if (response.data.success) {
        sessionStorage.setItem("resetEmail", cleanEmail);

        showAlert("OTP verified successfully", "success", () => {
          navigate("/resetPassword");
        });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Enter your registered email to reset your password.
        </p>

        {!showOtp ? (
          <form onSubmit={(e) => { e.preventDefault(); handleForget(); }} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-5">
            <p className="text-center text-gray-600">
              OTP sent to <b>{email}</b>
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                placeholder="Enter 6 digit OTP"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 transition"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-6">
          <Link to="/login" className="text-pink-600 font-semibold hover:underline">
            Back to Login
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

export default ForgetPassword;
