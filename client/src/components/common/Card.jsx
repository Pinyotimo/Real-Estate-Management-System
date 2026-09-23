import React from 'react';

/**
 * Card component with Tailwind utility classes following the design system.
 */
const Card = ({ 
  children, 
  className = '',
  padding = 'normal',
  hover = true,
  title,
  subtitle,
  headerActions,
  onClick,
  ...props 
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    normal: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  // Safe fallback if an invalid padding key is provided
  const resolvedPadding = paddingClasses[padding] || paddingClasses.normal;

  const hoverClass = hover 
    ? 'hover:shadow-md transition-shadow duration-200' 
    : '';

  const isInteractive = Boolean(onClick);

  return (
    <div
      className={`
        bg-surface rounded-lg border border-border shadow-sm
        ${resolvedPadding}
        ${hoverClass}
        ${isInteractive ? 'cursor-pointer hover:border-border-hover' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      {...props}
    >
      {(title || subtitle || headerActions) && (
        <div 
          className={`flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border-light ${
            padding === 'none' ? 'px-4 pt-4 sm:px-6 sm:pt-6' : ''
          }`}
        >
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-lg font-semibold text-text-primary tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;