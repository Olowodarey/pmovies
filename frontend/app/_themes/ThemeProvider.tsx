"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

const Theme = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default Theme;
