import React from 'react';

export const Input = ({ label, id, className, ...props }) => (
  <div className="space-y-1">
    {label && <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>}
    <input
      id={id}
      className={`w-full rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${className || ''}`}
      {...props}
    />
  </div>
);

export const Select = ({ label, id, options, className, ...props }) => (
  <div className="space-y-1">
    {label && <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>}
    <select
      id={id}
      className={`w-full rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${className || ''}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const Textarea = ({ label, id, className, ...props }) => (
  <div className="space-y-1">
    {label && <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>}
    <textarea
      id={id}
      className={`w-full rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${className || ''}`}
      {...props}
    />
  </div>
);