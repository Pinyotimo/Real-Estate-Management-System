import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext(null);

export const THEMES = ["light", "dark", "system"];

const STORAGE_KEY = "theme";

const readStoredTheme = () => {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : "system";
  } catch {
    return "system";
  }
};

const getSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const ThemeProvider = ({ children }) => {
  // "system" | "light" | "dark" — the user's explicit preference
  const [theme, setThemeState] = useState(readStoredTheme);
  // The OS preference, kept in state so "system" stays live
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  // The theme actually painted on the page
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  // Track OS-level changes
  useEffect(() => {
    if (!window.matchMedia) return undefined;

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) =>
      setSystemTheme(event.matches ? "dark" : "light");

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  // Apply the resolved theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
    root.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  // Persist the preference
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable (private mode) — preference is not persisted */
    }
  }, [theme]);

  const setTheme = (nextTheme) => {
    if (!THEMES.includes(nextTheme)) return;
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    // Cycle light → dark → system → light
    const order = ["light", "dark", "system"];
    const currentIndex = order.indexOf(theme);
    setTheme(order[(currentIndex + 1) % order.length]);
  };

  const value = useMemo(
    () => ({ theme, resolvedTheme, systemTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, systemTheme]
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
