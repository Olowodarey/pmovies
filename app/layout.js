import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./_component/SideNavbar";
import Header from "./_component/header";
import Theme from "@/app/_themes/ThemeProvider";
import ReduxProvider from "./_provider/ReduxProvider";
import Footer from "./_component/Footer";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: {
    template: " %s / movie page",
    default: "movie collection",
  },
  description: "movie",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ReduxProvider>

      <Theme>
        <body className={`${josefinSans.className} antialiased`}>
        <Header />
          <div className="flex  lg:flex lg:min-h-screen">
            <Navbar />
          
            <main className="flex-1 max-w-7xl lg:ml-64  ">
         
              {children}
            </main>

          
          </div>

          <Footer />
        </body>
      </Theme>


      </ReduxProvider>
    
    </html>
  );
}
