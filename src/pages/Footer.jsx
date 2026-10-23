import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200 py-4 px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 shadow-inner">
      <div className="mb-2 sm:mb-0">
        <span className="font-semibold text-gray-700">MBBS Counselling</span> © {currentYear} Admin Panel. All rights reserved.
      </div>
      <div className="flex items-center gap-4 text-xs">
        <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">
          ● System Online
        </span>
        <span className="text-gray-400">v1.0.0</span>
      </div>
    </footer>
  );
};

export default Footer;
