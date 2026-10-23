import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

/**
 * AlertModal - Beginner-friendly popup modal component.
 * Replaces browser native window.alert(...) with a clean, modern popup modal.
 *
 * Props:
 * - isOpen (boolean): Whether the modal is visible
 * - onClose (function): Callback to close the modal
 * - title (string): Heading title (e.g. "Success", "Action Required")
 * - message (string): The alert message text
 * - type (string): "success" | "error" | "warning" | "info"
 * - isConfirm (boolean): Set to true to show Cancel + Confirm buttons
 * - onConfirm (function): Callback when user clicks Confirm / OK
 * - confirmText (string): Label for confirm button (default "OK")
 * - cancelText (string): Label for cancel button (default "Cancel")
 */
const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  isConfirm = false,
  onConfirm = null,
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  // If not open, don't render anything
  if (!isOpen) return null;

  // Step 1: Choose icon and colors based on alert type
  let icon = <Info className="w-8 h-8 text-blue-600" />;
  let iconBg = "bg-blue-100";
  let buttonBg = "bg-blue-600 hover:bg-blue-700 text-white";

  if (type === "success") {
    icon = <CheckCircle2 className="w-8 h-8 text-emerald-600" />;
    iconBg = "bg-emerald-100";
    buttonBg = "bg-emerald-600 hover:bg-emerald-700 text-white";
  } else if (type === "error") {
    icon = <AlertCircle className="w-8 h-8 text-rose-600" />;
    iconBg = "bg-rose-100";
    buttonBg = "bg-rose-600 hover:bg-rose-700 text-white";
  } else if (type === "warning") {
    icon = <AlertCircle className="w-8 h-8 text-amber-600" />;
    iconBg = "bg-amber-100";
    buttonBg = "bg-amber-600 hover:bg-amber-700 text-white";
  }

  // Step 2: Handle button clicks
  const handleConfirmClick = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center relative border border-gray-100 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 rounded-lg cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Icon */}
        <div
          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm ${iconBg}`}
        >
          {icon}
        </div>

        {/* Modal Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {title || (type === "success" ? "Success" : type === "error" ? "Notice" : "Information")}
        </h3>

        {/* Modal Message */}
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Modal Buttons */}
        {isConfirm ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirmClick}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition cursor-pointer shadow-sm ${buttonBg}`}
            >
              {confirmText}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleConfirmClick}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold transition cursor-pointer shadow-sm ${buttonBg}`}
          >
            {confirmText}
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertModal;
