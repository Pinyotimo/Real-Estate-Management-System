import React from 'react';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={`
        bg-surface rounded-lg shadow-sm border border-border 
        hover:shadow-md transition-shadow duration-200
        p-6 ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;