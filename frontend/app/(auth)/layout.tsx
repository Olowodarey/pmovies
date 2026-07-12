import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/public/logo.png";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <div className="py-6 px-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image src={logo} alt="logo" />
          <span className="font-bold tracking-wide text-brand">Movies</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">{children}</div>
    </div>
  );
}
