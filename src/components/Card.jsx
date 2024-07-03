import React from "react";

export default function Card({ children, className = "", customStyle }) {
  return (
    <div
      className={`${
        customStyle ? customStyle : "w-[400px]"
      } rounded-2xl bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}
