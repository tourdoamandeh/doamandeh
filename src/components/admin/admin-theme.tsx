"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface AdminThemeContextType {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

const STORAGE_KEY = "admin-theme-preference";

function applyThemeToDOM(activeTheme: ThemePreference): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const isDark = activeTheme === "dark" || (activeTheme === "system" && mediaQuery.matches);
  const resolved: ResolvedTheme = isDark ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", "admin");

  if (isDark) {
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-admin-mode", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.setAttribute("data-admin-mode", "light");
  }

  return resolved;
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    let initialPref: ThemePreference = "system";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
      if (stored === "light" || stored === "dark" || stored === "system") {
        initialPref = stored;
        setThemeState(stored);
      }
    } catch {
      // Storage access blocked or unavailable
    }

    const resolved = applyThemeToDOM(initialPref);
    setResolvedTheme(resolved);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      let current: ThemePreference = "system";
      try {
        const s = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
        if (s === "light" || s === "dark" || s === "system") {
          current = s;
        }
      } catch {}

      if (current === "system") {
        const res = applyThemeToDOM("system");
        setResolvedTheme(res);
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.removeAttribute("data-admin-mode");
      document.documentElement.classList.remove("dark");
    };
  }, []);

  const setTheme = useCallback((newTheme: ThemePreference) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Storage access blocked or quota exceeded
    }
    const res = applyThemeToDOM(newTheme);
    setResolvedTheme(res);
  }, []);

  return (
    <AdminThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
}

export function AdminTheme() {
  return null;
}
