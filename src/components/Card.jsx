import React from "react";

export default function Card({ children, className, customWidth }) {
  return (
    <div
      className={`${
        customWidth ? customWidth : "w-[400px]"
      } rounded-2xl bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}
