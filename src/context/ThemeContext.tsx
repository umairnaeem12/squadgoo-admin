"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";
type ThemeMode = "auto" | "manual";

type ThemeContextType = {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setManualTheme: (value: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [manualTheme, setManualTheme] = useState<Theme>("light");
  const [themeMode, setThemeMode] = useState<ThemeMode>("manual");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This code will only run on the client side
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedMode = localStorage.getItem("themeMode") as ThemeMode | null;
    const initialTheme = savedTheme || "light"; // Default to light theme

    setManualTheme(initialTheme);
    setThemeMode(savedMode || "manual");
    setIsInitialized(true);
  }, []);

  const resolveAutoTheme = () => {
    if (typeof window === "undefined") {
      return "light" as Theme;
    }
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const hour = new Date().getHours();
    const isNight = hour >= 19 || hour < 6;
    return prefersDark || isNight ? "dark" : "light";
  };

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    const nextTheme = themeMode === "manual" ? manualTheme : resolveAutoTheme();
    setTheme(nextTheme);
    localStorage.setItem("theme", manualTheme);
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode, manualTheme, isInitialized]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, isInitialized]);

  useEffect(() => {
    if (!isInitialized || themeMode !== "auto") {
      return;
    }
    const applyAuto = () => setTheme(resolveAutoTheme());
    const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener("change", applyAuto);
    } else if (mediaQuery?.addListener) {
      mediaQuery.addListener(applyAuto);
    }
    const timer = setInterval(applyAuto, 5 * 60 * 1000);
    return () => {
      clearInterval(timer);
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener("change", applyAuto);
      } else if (mediaQuery?.removeListener) {
        mediaQuery.removeListener(applyAuto);
      }
    };
  }, [themeMode, isInitialized]);

  const toggleTheme = () => {
    setThemeMode("manual");
    setManualTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{ theme, themeMode, toggleTheme, setThemeMode, setManualTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
