import React from "react";

export function Button({ children, onClick, disabled, variant = "", className = "" }) {
  const baseStyles =
    "px-4 py-2 text-sm font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || ""} ${className}`}
    >
      {children}
    </button>
  );
}
