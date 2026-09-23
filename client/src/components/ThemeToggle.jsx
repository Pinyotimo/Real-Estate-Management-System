import React from "react";
import PropTypes from "prop-types";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className={`p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors cursor-pointer flex items-center justify-center ${className}`.trim()}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
};

ThemeToggle.propTypes = {
  className: PropTypes.string,
};

export default ThemeToggle;