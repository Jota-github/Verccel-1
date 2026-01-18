import React from 'react';

export const Button = ({ children, onClick, icon: Icon, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-[#F2A933] hover:bg-[#e09622] text-[#003366] font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${className}`}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};