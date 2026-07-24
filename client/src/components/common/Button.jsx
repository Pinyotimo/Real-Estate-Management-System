import React from 'react';

const Button = ({
  variant = 'primary',
  children,
  className,
  loading,
  disabled,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-brand-blue text-white hover:bg-[#1A6AA8] focus:ring-2 focus:ring-brand-blue/50',
    secondary: 'bg-secondary text-black hover:bg-[#7EC8E8] focus:ring-2 focus:ring-secondary/50',
    outline: 'border border-border bg-transparent hover:bg-muted',
    ghost: 'hover:bg-muted',
    danger: 'bg-danger text-white hover:bg-[#dc2626] focus:ring-2 focus:ring-danger/50',
    success: 'bg-success text-white hover:bg-[#059669] focus:ring-2 focus:ring-success/50',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${variantClasses[variant] || variantClasses.primary}
        ${className || ''}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;