import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import { THEMES, useTheme } from "../context/ThemeProvider";

const MODE_OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

const SWATCH = {
  daylight: ["#2563eb", "#eff6ff"],
  midnight: ["#6366f1", "#1e1b4b"],
  terracotta: ["#c2410c", "#fff7ed"],
  forest: ["#0f766e", "#ecfdf5"],
  plum: ["#9333ea", "#faf5ff"],
  graphite: ["#334155", "#f8fafc"],
};

const ThemeToggle = ({ className = "", align = "right", showLabel = false }) => {
  const { theme, mode, setTheme, setMode } = useTheme();
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

  const activeTheme = THEMES.find((item) => item.value === theme);

  return (
    <div className={`relative ${className}`.trim()} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${activeTheme?.label || theme}`}
        title={`Theme: ${activeTheme?.label || theme}`}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-surface px-2.5 text-text-secondary transition-all hover:-translate-y-0.5 hover:bg-surface-soft hover:text-text-primary hover:shadow-soft"
      >
        <span className="relative flex h-4 w-4 items-center justify-center">
          <Palette className="h-4 w-4" />
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-surface"
            style={{ backgroundColor: SWATCH[theme]?.[0] }}
          />
        </span>
        {showLabel && (
          <span className="hidden text-xs font-semibold sm:inline">
            {activeTheme?.label || "Theme"}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme and appearance"
          className={`absolute z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-popover p-2 shadow-float ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <p className="px-2 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Theme
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {THEMES.map((item) => {
              const isActive = theme === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => {
                    setTheme(item.value);
                    setOpen(false);
                  }}
                  className={`group flex items-center gap-2 rounded-xl border px-2 py-2 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft ${
                    isActive
                      ? "border-brand-blue/30 bg-brand-very-light-blue"
                      : "border-border bg-surface hover:bg-surface-soft"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 rounded-lg ring-1 ring-black/10"
                    style={{
                      background: `linear-gradient(135deg, ${SWATCH[item.value][0]} 0%, ${SWATCH[item.value][0]} 55%, ${SWATCH[item.value][1]} 55%)`,
                    }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-bold text-text-primary">
                      {item.label}
                    </span>
                    <span className="block truncate text-[9px] text-text-muted">
                      {item.description}
                    </span>
                  </span>
                  {isActive && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-brand-blue" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="my-2 border-t border-border" />

          <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Appearance
          </p>
          <div className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-surface-soft p-1">
            {MODE_OPTIONS.map(({ value, label, Icon }) => {
              const isActive = mode === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => {
                    setMode(value);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-all ${
                    isActive
                      ? "bg-surface text-brand-blue shadow-soft"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
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
