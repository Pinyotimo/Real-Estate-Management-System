import React from 'react';

/**
 * LoadingSkeleton component with consistent styling following the design system.
 * Uses CSS variables from index.css for theming.
 */
const LoadingSkeleton = ({ 
  variant = 'text',
  rows = 4,
  columns = 1,
  className = '',
  containerClassName = '',
  width = '100%',
  height,
  rounded = 'md',
  animate = true,
  ...props 
}) => {
  const variants = {
    text: {
      className: 'h-4',
      wrapper: 'space-y-3',
    },
    heading: {
      className: 'h-8',
      wrapper: 'space-y-4',
    },
    card: {
      className: 'h-48 rounded-lg',
      wrapper: 'grid gap-4',
    },
    avatar: {
      className: 'h-12 w-12 rounded-full',
      wrapper: 'flex items-center gap-4',
    },
    image: {
      className: 'h-64 w-full rounded-lg',
      wrapper: 'space-y-4',
    },
    table: {
      className: 'h-10',
      wrapper: 'space-y-3',
    },
    form: {
      className: 'h-10 rounded-lg',
      wrapper: 'space-y-4',
    },
    button: {
      className: 'h-10 w-32 rounded-lg',
      wrapper: 'flex gap-3',
    },
    badge: {
      className: 'h-6 w-16 rounded-full',
      wrapper: 'flex gap-2',
    },
  };

  const variantStyle = variants[variant] || variants.text;

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const widthClass = width !== '100%' ? `w-[${width}]` : 'w-full';

  const heightClass = height ? `h-[${height}]` : '';

  const animationClass = animate ? 'animate-pulse' : '';

  // Generate random width for text lines to look more natural
  const getRandomWidth = () => {
    const widths = ['w-full', 'w-3/4', 'w-5/6', 'w-2/3', 'w-1/2', 'w-4/5'];
    return widths[Math.floor(Math.random() * widths.length)];
  };

  // Render different skeleton types
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={cn('bg-gray-200 rounded-lg', variantStyle.className, className)}>
            <div className="flex flex-col h-full p-4 gap-3">
              <div className="skeleton skeleton--text w-3/4 h-4" />
              <div className="skeleton skeleton--text w-1/2 h-3" />
              <div className="skeleton skeleton--text w-full h-3 mt-auto" />
            </div>
          </div>
        );

      case 'avatar':
        return (
          <div className="flex items-center gap-4">
            <div className={cn('bg-gray-200 rounded-full', variantStyle.className, className)} />
            <div className="flex-1 space-y-2">
              <div className="skeleton skeleton--text w-3/4 h-4" />
              <div className="skeleton skeleton--text w-1/2 h-3" />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="space-y-2">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'bg-gray-200 rounded',
                    variantStyle.className,
                    className,
                    i === 0 ? 'w-1/3' : 'w-1/6'
                  )}
                />
              ))}
            </div>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex gap-4">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className={cn(
                      'bg-gray-200 rounded',
                      variantStyle.className,
                      className,
                      colIndex === 0 ? 'w-1/3' : 'w-1/6',
                      colIndex === 1 ? 'w-1/4' : ''
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        );

      case 'form':
        return (
          <div className="space-y-4">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton skeleton--text w-24 h-3" />
                <div className={cn('bg-gray-200 rounded-lg', variantStyle.className, className)} />
              </div>
            ))}
          </div>
        );

      case 'button':
        return (
          <div className="flex gap-3">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className={cn('bg-gray-200 rounded-lg', variantStyle.className, className)} />
            ))}
          </div>
        );

      case 'badge':
        return (
          <div className="flex gap-2">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className={cn('bg-gray-200 rounded-full', variantStyle.className, className)} />
            ))}
          </div>
        );

      case 'heading':
        return (
          <div className={variantStyle.wrapper}>
            <div className={cn('bg-gray-200 rounded', variantStyle.className, className, getRandomWidth())} />
            <div className="skeleton skeleton--text w-2/3 h-4" />
          </div>
        );

      case 'text':
      default:
        return (
          <div className={variantStyle.wrapper}>
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'bg-gray-200 rounded',
                  variantStyle.className,
                  className,
                  i === rows - 1 ? 'w-2/3' : getRandomWidth()
                )}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div 
      className={cn(
        animationClass,
        variantStyle.wrapper,
        containerClassName
      )}
      style={{ 
        backgroundColor: 'var(--surface-soft)',
        ...props.style 
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading..."
      {...props}
    >
      {renderSkeleton()}
      <span className="sr-only">Loading content...</span>
    </div>
  );
};

// Utility function for conditional class joining
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default LoadingSkeleton;