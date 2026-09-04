"use client";

import { useEffect } from "react";

export function AdminTheme() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "admin");
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  return null;
}
