"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

const Theme = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
};

export default Theme;
