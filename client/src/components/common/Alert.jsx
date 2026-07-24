import React from 'react';

const Alert = ({ variant = 'info', children, className = '' }) => {
  const variants = {
    info: 'bg-blue-50 text-brand-blue border-blue-200',
    danger: 'bg-red-50 text-danger border-red-200',
    success: 'bg-green-50 text-success border-green-200',
    warning: 'bg-yellow-50 text-warning border-yellow-200',
  };
  return (
    <div className={`p-4 rounded-md border ${variants[variant]} ${className}`} role="alert">
      {children}
    </div>
  );
};

export default Alert;