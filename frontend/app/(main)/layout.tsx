import type { ReactNode } from "react";
import Navbar from "@/app/_component/SideNavbar";
import Header from "@/app/_component/header";
import Footer from "@/app/_component/Footer";
import WelcomeModal from "@/app/_component/WelcomeModal";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex lg:flex lg:min-h-screen overflow-x-hidden">
        <Navbar />

        <div className="flex-1 lg:pl-80 min-w-0">
          <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 overflow-x-hidden">{children}</main>
        </div>
      </div>

      <Footer />
      <WelcomeModal />
    </>
  );
}
