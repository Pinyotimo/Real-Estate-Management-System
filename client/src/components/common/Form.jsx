import React, { forwardRef } from 'react';
import { AlertCircle, CheckCircle, ChevronDown, Eye, EyeOff } from 'lucide-react';

// Class merger utility
const cn = (...classes) => classes.filter(Boolean).join(' ');

/* -------------------------------------------------------------------------- */
/*                                    INPUT                                   */
/* -------------------------------------------------------------------------- */
export const Input = forwardRef(
  ({ 
    label, 
    id, 
    error, 
    helperText, 
    required, 
    className, 
    containerClassName,
    icon: Icon,
    type = 'text',
    size = 'md',
    ...props 
  }, ref) => {
    const inputId = id || props.name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const helperId = helperText && inputId ? `${inputId}-helper` : undefined;
    
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const sizeClasses = {
      sm: 'px-2.5 py-1.5 text-xs min-h-[32px]',
      md: 'px-3.5 py-2 text-sm min-h-[40px]',
      lg: 'px-4 py-2.5 text-base min-h-[48px]',
    };

    const iconPadding = Icon ? (isPassword ? 'pl-9 pr-10' : 'pl-9') : (isPassword ? 'pr-10' : '');

    return (
      <div className={cn("space-y-1.5 text-left", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text-primary">
            {label} {required && <span className="text-danger font-semibold">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="text-text-muted" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperId}
            className={cn(
              "w-full rounded-lg border bg-surface text-text-primary shadow-sm transition-all duration-150",
              "placeholder:text-text-muted/60",
              "focus:outline-none focus:ring-2 focus:ring-offset-1",
              sizeClasses[size] || sizeClasses.md,
              iconPadding,
              error
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "border-border focus:border-primary focus:ring-primary/20 hover:border-border/80",
              "disabled:cursor-not-allowed disabled:bg-surface-soft disabled:opacity-50",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} /> : <Eye size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
            </button>
          )}
        </div>
        {error && (
          <p id={errorId} className="flex items-center gap-1 text-xs font-medium text-danger">
            <AlertCircle size={12} /> {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

/* -------------------------------------------------------------------------- */
/*                                   SELECT                                   */
/* -------------------------------------------------------------------------- */
export const Select = forwardRef(
  (
    {
      label,
      id,
      options,
      children,
      placeholder,
      error,
      helperText,
      required,
      className,
      containerClassName,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name;
    const errorId = error && selectId ? `${selectId}-error` : undefined;
    const helperId = helperText && selectId ? `${selectId}-helper` : undefined;

    const sizeClasses = {
      sm: 'px-2.5 py-1.5 text-xs min-h-[32px]',
      md: 'px-3.5 py-2 text-sm min-h-[40px]',
      lg: 'px-4 py-2.5 text-base min-h-[48px]',
    };

    return (
      <div className={cn("space-y-1.5 text-left", containerClassName)}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-text-primary">
            {label} {required && <span className="text-danger font-semibold">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperId}
            className={cn(
              "w-full appearance-none rounded-lg border bg-surface text-text-primary shadow-sm transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-offset-1",
              sizeClasses[size] || sizeClasses.md,
              "pr-10",
              error
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "border-border focus:border-primary focus:ring-primary/20 hover:border-border/80",
              "disabled:cursor-not-allowed disabled:bg-surface-soft disabled:opacity-50",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {children
              ? children
              : options?.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
            <ChevronDown size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="opacity-70" />
          </div>
        </div>
        {error && (
          <p id={errorId} className="flex items-center gap-1 text-xs font-medium text-danger">
            <AlertCircle size={12} /> {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

/* -------------------------------------------------------------------------- */
/*                                  TEXTAREA                                  */
/* -------------------------------------------------------------------------- */
export const Textarea = forwardRef(
  ({ 
    label, 
    id, 
    error, 
    helperText, 
    required, 
    className, 
    containerClassName,
    size = 'md',
    rows = 4,
    ...props 
  }, ref) => {
    const textareaId = id || props.name;
    const errorId = error && textareaId ? `${textareaId}-error` : undefined;
    const helperId = helperText && textareaId ? `${textareaId}-helper` : undefined;

    const sizeClasses = {
      sm: 'px-2.5 py-1.5 text-xs min-h-[60px]',
      md: 'px-3.5 py-2.5 text-sm min-h-[90px]',
      lg: 'px-4 py-3 text-base min-h-[120px]',
    };

    return (
      <div className={cn("space-y-1.5 text-left", containerClassName)}>
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-text-primary">
            {label} {required && <span className="text-danger font-semibold">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperId}
          className={cn(
            "w-full rounded-lg border bg-surface text-text-primary shadow-sm transition-all duration-150 resize-y",
            "placeholder:text-text-muted/60",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            sizeClasses[size] || sizeClasses.md,
            error
              ? "border-danger focus:border-danger focus:ring-danger/20"
              : "border-border focus:border-primary focus:ring-primary/20 hover:border-border/80",
            "disabled:cursor-not-allowed disabled:bg-surface-soft disabled:opacity-50",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="flex items-center gap-1 text-xs font-medium text-danger">
            <AlertCircle size={12} /> {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';