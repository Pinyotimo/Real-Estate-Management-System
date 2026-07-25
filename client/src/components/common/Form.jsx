import React, { forwardRef } from 'react';

// Class merger utility (handles conditional class joining cleanly)
const cn = (...classes) => classes.filter(Boolean).join(' ');

/* -------------------------------------------------------------------------- */
/*                                    INPUT                                   */
/* -------------------------------------------------------------------------- */
export const Input = forwardRef(
  ({ label, id, error, helperText, required, className, containerClassName, ...props }, ref) => {
    const inputId = id || props.name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const helperId = helperText && inputId ? `${inputId}-helper` : undefined;

    return (
      <div className={cn("space-y-1.5 text-left", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
            {label} {required && <span className="text-destructive font-semibold">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperId}
          className={cn(
            "w-full rounded-lg border bg-surface px-3.5 py-2 text-sm text-foreground shadow-sm transition-all duration-150",
            "placeholder:text-muted-foreground/60",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/20"
              : "border-border focus:border-primary focus:ring-primary/20 hover:border-border/80",
            "disabled:cursor-not-allowed disabled:bg-muted/30 disabled:opacity-50",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs font-medium text-destructive">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-muted-foreground">
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
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name;
    const errorId = error && selectId ? `${selectId}-error` : undefined;
    const helperId = helperText && selectId ? `${selectId}-helper` : undefined;

    return (
      <div className={cn("space-y-1.5 text-left", containerClassName)}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-foreground">
            {label} {required && <span className="text-destructive font-semibold">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperId}
            className={cn(
              "w-full appearance-none rounded-lg border bg-surface px-3.5 py-2 pr-10 text-sm text-foreground shadow-sm transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-offset-1",
              error
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : "border-border focus:border-primary focus:ring-primary/20 hover:border-border/80",
              "disabled:cursor-not-allowed disabled:bg-muted/30 disabled:opacity-50",
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
          {/* Custom Dropdown Chevron */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
            <svg
              className="h-4 w-4 fill-current opacity-70"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={errorId} className="text-xs font-medium text-destructive">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-muted-foreground">
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
  ({ label, id, error, helperText, required, className, containerClassName, ...props }, ref) => {
    const textareaId = id || props.name;
    const errorId = error && textareaId ? `${textareaId}-error` : undefined;
    const helperId = helperText && textareaId ? `${textareaId}-helper` : undefined;

    return (
      <div className={cn("space-y-1.5 text-left", containerClassName)}>
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-foreground">
            {label} {required && <span className="text-destructive font-semibold">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperId}
          className={cn(
            "w-full min-h-[90px] rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-sm transition-all duration-150 resize-y",
            "placeholder:text-muted-foreground/60",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/20"
              : "border-border focus:border-primary focus:ring-primary/20 hover:border-border/80",
            "disabled:cursor-not-allowed disabled:bg-muted/30 disabled:opacity-50",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs font-medium text-destructive">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';