import React from 'react';

const LoadingSkeleton = ({ rows = 4, className = '' }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-6 bg-muted rounded w-full" />
      ))}
    </div>
  );
};

export default LoadingSkeleton;