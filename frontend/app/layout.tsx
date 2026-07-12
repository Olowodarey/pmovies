import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Theme from "@/app/_themes/ThemeProvider";
import ReduxProvider from "./_provider/ReduxProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    template: " %s / movie page",
    default: "movie collection",
  },
  description: "movie",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ReduxProvider>
        <Theme>
          <body className={`${inter.variable} ${playfairDisplay.variable} font-sans antialiased`}>
            {children}
          </body>
        </Theme>
      </ReduxProvider>
    </html>
  );
}
