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
      container: 'bg-blue-50 border-l-blue-500 text-blue-700',
      iconColor: 'text-blue-500',
      icon: Info,
    },
    success: {
      container: 'bg-green-50 border-l-green-500 text-green-700',
      iconColor: 'text-green-500',
      icon: CheckCircle,
    },
    warning: {
      container: 'bg-yellow-50 border-l-yellow-500 text-yellow-700',
      iconColor: 'text-yellow-500',
      icon: AlertTriangle,
    },
    danger: {
      container: 'bg-red-50 border-l-red-500 text-red-700',
      iconColor: 'text-red-500',
      icon: AlertCircle,
    },
  };

  const variantStyle = variants[variant] || variants.info;
  const Icon = CustomIcon || variantStyle.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${variantStyle.container} ${className}`}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <div className={`flex-shrink-0 mt-0.5 ${variantStyle.iconColor}`}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        {title && <div className="font-semibold text-sm mb-0.5">{title}</div>}
        <div className="text-sm text-gray-700">{children}</div>
      </div>
      {dismissible && onClose && (
        <button
          type="button"
          className={`flex-shrink-0 rounded-md p-1 transition-colors hover:bg-white/50 ${variantStyle.iconColor}`}
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