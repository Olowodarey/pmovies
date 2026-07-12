"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/public/logo.png";
import { FaSun, FaMoon, FaUserCircle } from "react-icons/fa";
import { useGetMeQuery } from "@/app/_services/backendApi";
import MobileNavbar from "./mobileNav";
import Search from "./scarch";

const Header = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: user } = useGetMeQuery();

  useEffect(() => {
    // Required by next-themes to avoid an SSR/client icon mismatch (server
    // doesn't know the persisted theme yet); mounted gates the first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="py-3 px-5 lg:px-10 bg-surface border-b border-edge">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <Image src={logo} alt="logo" />
          <span className="font-bold tracking-wide text-brand">Movies</span>
        </div>

        <div className="hidden pl-[80px] lg:flex">
          <Search />
        </div>

        <div className="flex items-center space-x-4 lg:space-x-5">
          <Link
            href={user ? "/profile" : "/login"}
            className="text-ink-muted hover:text-brand transition-colors"
            aria-label={user ? "Profile" : "Log in"}
          >
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt=""
                width={22}
                height={22}
                className="rounded-full ring-1 ring-edge"
              />
            ) : (
              <FaUserCircle className="h-5 w-5" />
            )}
          </Link>

          <button
            className="text-ink-muted hover:text-brand transition-colors"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <FaSun className="h-5 w-5" />
            ) : (
              <FaMoon className="h-5 w-5" />
            )}
          </button>

          <div className="lg:hidden flex items-center">
            <MobileNavbar />
          </div>
        </div>
      </div>

      {/* mobile */}

      <div className="mt-4 flex justify-center lg:hidden">
        <Search />
      </div>
    </div>
  );
};

export default Header;
