import React from 'react';
import { X, Info, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * Alert component with Tailwind utility classes following the design system.
 */
const Alert = ({ 
  variant = 'info', 
  title, 
  children, 
  className = '', 
  onClose,
  icon: CustomIcon,
  dismissible = false,
  ...props 
}) => {
  const variants = {
    info: {
      container: 'bg-brand-very-light-blue border-l-brand-blue text-text-primary',
      iconColor: 'text-brand-blue',
      icon: Info,
    },
    success: {
      container: 'bg-success/10 border-l-success text-text-primary',
      iconColor: 'text-success',
      icon: CheckCircle,
    },
    warning: {
      container: 'bg-warning/10 border-l-warning text-text-primary',
      iconColor: 'text-warning',
      icon: AlertTriangle,
    },
    danger: {
      container: 'bg-danger/10 border-l-danger text-text-primary',
      iconColor: 'text-danger',
      icon: AlertCircle,
    },
  };

  const variantStyle = variants[variant] || variants.info;
  const Icon = CustomIcon || variantStyle.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-border border-l-4 p-4 ${variantStyle.container} ${className}`}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <div className={`mt-0.5 flex-shrink-0 ${variantStyle.iconColor}`}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        {title && (
          <div className="mb-0.5 text-sm font-semibold text-text-primary">
            {title}
          </div>
        )}
        <div className="text-sm text-text-secondary">{children}</div>
      </div>
      {dismissible && onClose && (
        <button
          type="button"
          className={`flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${variantStyle.iconColor}`}
          onClick={onClose}
          aria-label="Dismiss alert"
        >
          <X size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};

export default Alert;