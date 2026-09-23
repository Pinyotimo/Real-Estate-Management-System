import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle, Home, Users, DollarSign } from 'lucide-react';

/**
 * Badge component with Tailwind utility classes following the design system.
 */
const Badge = ({ 
  variant = 'default', 
  children, 
  className = '',
  icon: CustomIcon,
  size = 'md',
  rounded = 'full',
  ...props 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    available: 'bg-green-50 text-green-700 border-green-200',
    occupied: 'bg-blue-50 text-blue-700 border-blue-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    paid: 'bg-green-50 text-green-700 border-green-200',
    overdue: 'bg-red-50 text-red-700 border-red-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    admin: 'bg-red-50 text-red-700 border-red-200',
    agent: 'bg-blue-50 text-blue-700 border-blue-200',
    tenant: 'bg-green-50 text-green-700 border-green-200',
    guest: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const iconMap = {
    available: CheckCircle,
    occupied: Home,
    pending: Clock,
    paid: CheckCircle,
    overdue: AlertCircle,
    approved: CheckCircle,
    rejected: XCircle,
    warning: AlertCircle,
    success: CheckCircle,
    danger: XCircle,
    info: AlertCircle,
    admin: Users,
    agent: Home,
    tenant: Users,
    guest: Users,
  };

  const Icon = CustomIcon || iconMap[variant] || null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const roundedClasses = {
    full: 'rounded-full',
    md: 'rounded-md',
    sm: 'rounded-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border ${variants[variant] || variants.default} ${sizeClasses[size]} ${roundedClasses[rounded]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'lg' ? 16 : size === 'sm' ? 12 : 14} strokeWidth={2} />}
      {children}
    </span>
  );
};

export default Badge;