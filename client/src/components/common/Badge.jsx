import React from 'react';

const Badge = ({ variant = 'default', children, className }) => {
  const colors = {
    default: 'bg-muted text-muted-foreground',
    available: 'bg-success/10 text-success border border-success/20',
    occupied: 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20',
    pending: 'bg-warning/10 text-warning border border-warning/20',
    paid: 'bg-success/10 text-success border border-success/20',
    overdue: 'bg-danger/10 text-danger border border-danger/20',
    approved: 'bg-success/10 text-success border border-success/20',
    rejected: 'bg-danger/10 text-danger border border-danger/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    success: 'bg-success/10 text-success border border-success/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${colors[variant] || colors.default} ${className || ''}`}>
      {children}
    </span>
  );
};

export default Badge;