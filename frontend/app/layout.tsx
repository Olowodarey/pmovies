import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./_component/SideNavbar";
import Header from "./_component/header";
import Theme from "@/app/_themes/ThemeProvider";
import ReduxProvider from "./_provider/ReduxProvider";
import Footer from "./_component/Footer";

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
            <Header />
            <div className="flex  lg:flex lg:min-h-screen">
              <Navbar />

              <main className="flex-1 max-w-7xl lg:ml-64  ">{children}</main>
            </div>

            <Footer />
          </body>
        </Theme>
      </ReduxProvider>
    </html>
  );
}
