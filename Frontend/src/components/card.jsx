import React from 'react';

export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white p-8 rounded-2xl shadow-2xl w-full max-w-[400px] border border-gray-100 ${className}`}>
      {children}
    </div>
  );
};