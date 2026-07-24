import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, breadcrumb = [], actions }) => {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumb.length > 0 && (
        <nav className="flex text-sm text-muted-foreground mb-2" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-2">
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;
              return (
                <li key={index} className="inline-flex items-center">
                  {!isLast ? (
                    <Link to={item.path} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium">{item.label}</span>
                  )}
                  {!isLast && <span className="mx-2 text-muted-foreground">/</span>}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      {/* Title and actions */}
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;