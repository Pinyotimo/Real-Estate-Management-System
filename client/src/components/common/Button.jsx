import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button component with Tailwind utility classes following the design system.
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) => {
  const variants = {
    primary: 'bg-brand-blue text-white hover:bg-[#1A6AA8] focus:ring-brand-blue/50 border-transparent',
    secondary: 'bg-secondary text-white hover:bg-[#333333] focus:ring-secondary/50 border-transparent',
    outline: 'border border-brand-blue bg-transparent text-brand-blue hover:bg-brand-very-light-blue focus:ring-brand-blue/50',
    ghost: 'bg-transparent text-text-primary hover:bg-surface-soft focus:ring-brand-blue/50 border-transparent',
    danger: 'bg-danger text-white hover:bg-[#333333] focus:ring-danger/50 border-transparent',
    success: 'bg-success text-white hover:bg-[#1A6AA8] focus:ring-success/50 border-transparent',
    warning: 'bg-warning text-white hover:bg-[#333333] focus:ring-warning/50 border-transparent',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-6 py-2.5 text-base min-h-[48px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-md
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${widthClass}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin flex-shrink-0" />
      )}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="flex-shrink-0" />
      )}
      {children}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="flex-shrink-0" />
      )}
    </button>
  );
};

export default Button;
