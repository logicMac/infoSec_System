import React from "react";

export function Button({ variant = "default", className = "", ...props }) {
  // Minimal button implementation to satisfy existing imports.
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:pointer-events-none";

  const styles =
    variant === "outline" || variant === "secondary"
      ? "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
      : "bg-black text-white hover:bg-zinc-800";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

