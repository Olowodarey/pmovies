"use client";

import { ThemeProvider } from "next-themes";

const Theme = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default Theme;
