import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const PageHeader = ({ 
  title, 
  subtitle,
  breadcrumb = [], 
  actions,
  icon: Icon,
  size = 'lg',
  className = '',
  containerClassName = '',
  showHome = true,
  separator = '/',
  ...props 
}) => {
  const location = useLocation();

  const breadcrumbItems = showHome 
    ? [{ label: 'Home', path: '/', icon: Home }, ...breadcrumb]
    : breadcrumb;

  const titleSizes = {
    sm: 'var(--font-size-xl)',
    md: 'var(--font-size-2xl)',
    lg: 'var(--font-size-3xl)',
    xl: 'var(--font-size-4xl)',
  };

  return (
    <div 
      className={containerClassName}
      style={{ marginBottom: 'var(--spacing-6)' }}
      {...props}
    >
      {breadcrumbItems.length > 0 && (
        <nav 
          className="flex text-sm mb-2"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center flex-wrap gap-1">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              const IconComponent = item.icon;

              return (
                <li key={index} className="inline-flex items-center">
                  {!isLast ? (
                    <Link
                      to={item.path}
                      className="flex items-center gap-1 transition-colors duration-150"
                      style={{ 
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                    >
                      {IconComponent && <IconComponent size={14} className="flex-shrink-0" />}
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <span 
                      className="flex items-center gap-1 font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {IconComponent && <IconComponent size={14} className="flex-shrink-0" />}
                      <span>{item.label}</span>
                    </span>
                  )}
                  {!isLast && (
                    <span 
                      className="mx-2 select-none"
                      style={{ color: 'var(--text-muted)' }}
                      aria-hidden="true"
                    >
                      {separator}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div className={`flex flex-wrap items-start justify-between gap-4 ${className}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {Icon && (
              <div 
                className="flex-shrink-0 p-2 rounded-lg"
                style={{ 
                  backgroundColor: 'var(--brand-very-light-blue)',
                  color: 'var(--brand-blue)',
                }}
              >
                <Icon size={size === 'xl' ? 28 : size === 'lg' ? 24 : size === 'sm' ? 16 : 20} />
              </div>
            )}
            <h1 
              className="font-bold truncate"
              style={{ 
                fontSize: titleSizes[size] || titleSizes.lg,
                color: 'var(--text-primary)',
              }}
            >
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;