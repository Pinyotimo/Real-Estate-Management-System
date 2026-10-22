import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

const ThemeToggle = ({ className = "", align = "right", showLabel = false }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const ActiveIcon = theme === "system" ? Monitor : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <div className={`relative ${className}`.trim()} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${theme}`}
        title={`Theme: ${theme}`}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-surface px-2.5 text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary"
      >
        <ActiveIcon className="h-4 w-4" />
        {showLabel && (
          <span className="hidden text-xs font-semibold capitalize sm:inline">
            {theme}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-float ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <p className="px-2.5 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Appearance
          </p>
          {OPTIONS.map(({ value, label, Icon }) => {
            const isActive = theme === value;
            return (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-very-light-blue text-brand-blue"
                    : "text-text-secondary hover:bg-surface-soft hover:text-text-primary"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

ThemeToggle.propTypes = {
  className: PropTypes.string,
  align: PropTypes.oneOf(["left", "right"]),
  showLabel: PropTypes.bool,
};

export default ThemeToggle;
