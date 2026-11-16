import { createContext, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext(null);

/**
 * Six curated UI themes. Each one carries its own brand ramp and surface
 * tint; the light/dark mode is a separate dimension so every theme works in
 * both appearances.
 */
export const THEMES = [
  { value: "daylight", label: "Daylight", description: "Clear blue, default" },
  { value: "midnight", label: "Midnight", description: "Deep indigo" },
  { value: "terracotta", label: "Terracotta", description: "Warm clay" },
  { value: "forest", label: "Forest", description: "Calm green" },
  { value: "plum", label: "Plum", description: "Rich purple" },
  { value: "graphite", label: "Graphite", description: "Neutral slate" },
];

export const MODES = ["light", "dark", "system"];

const THEME_KEY = "theme";
const MODE_KEY = "color-mode";

const readStored = (key, allowed, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return allowed.includes(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
};

const getSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const ThemeProvider = ({ children }) => {
  // The selected accent theme (daylight, midnight, ...)
  const [theme, setThemeState] = useState(() =>
    readStored(
      THEME_KEY,
      THEMES.map((item) => item.value),
      "daylight"
    )
  );
  // The appearance mode (light, dark, system)
  const [mode, setModeState] = useState(() => readStored(MODE_KEY, MODES, "system"));
  // The OS preference, kept live so "system" stays responsive
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const resolvedMode = mode === "system" ? systemTheme : mode;

  useEffect(() => {
    if (!window.matchMedia) return undefined;

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) =>
      setSystemTheme(event.matches ? "dark" : "light");

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedMode === "dark");
    root.style.colorScheme = resolvedMode;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-mode", resolvedMode);
  }, [theme, resolvedMode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(MODE_KEY, mode);
    } catch {
      /* storage unavailable */
    }
  }, [mode]);

  const setTheme = (nextTheme) => {
    if (!THEMES.some((item) => item.value === nextTheme)) return;
    setThemeState(nextTheme);
  };

  const setMode = (nextMode) => {
    if (!MODES.includes(nextMode)) return;
    setModeState(nextMode);
  };

  const toggleMode = () => {
    const order = ["light", "dark", "system"];
    const currentIndex = order.indexOf(mode);
    setMode(order[(currentIndex + 1) % order.length]);
  };

  const cycleTheme = () => {
    const values = THEMES.map((item) => item.value);
    const currentIndex = values.indexOf(theme);
    setTheme(values[(currentIndex + 1) % values.length]);
  };

  const value = useMemo(
    () => ({
      theme,
      mode,
      resolvedMode,
      systemTheme,
      resolvedTheme: resolvedMode,
      setTheme,
      setMode,
      toggleMode,
      toggleTheme: cycleTheme,
    }),
    [theme, mode, resolvedMode, systemTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
