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
    default: 'bg-surface-soft text-text-secondary border-border',
    available: 'bg-success/10 text-success border-success/25',
    occupied: 'bg-brand-very-light-blue text-brand-blue border-brand-blue/25',
    pending: 'bg-warning/10 text-warning border-warning/25',
    paid: 'bg-success/10 text-success border-success/25',
    overdue: 'bg-danger/10 text-danger border-danger/25',
    approved: 'bg-success/10 text-success border-success/25',
    rejected: 'bg-danger/10 text-danger border-danger/25',
    warning: 'bg-warning/10 text-warning border-warning/25',
    success: 'bg-success/10 text-success border-success/25',
    danger: 'bg-danger/10 text-danger border-danger/25',
    info: 'bg-brand-very-light-blue text-brand-blue border-brand-blue/25',
    admin: 'bg-danger/10 text-danger border-danger/25',
    agent: 'bg-brand-very-light-blue text-brand-blue border-brand-blue/25',
    tenant: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    guest: 'bg-surface-soft text-text-secondary border-border',
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