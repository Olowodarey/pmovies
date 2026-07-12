"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import logo from "@/app/public/logo.png";
import { FaSun, FaMoon } from "react-icons/fa";
import MobileNavbar from "./mobileNav";
import Search from "./scarch";

const Header = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
    <div className="py-2 px-5 lg:px-10 bg-gray-700 ">
      <div className="flex justify-between">
        <div className="flex space-x-1 items-center ">
          <Image src={logo} alt="logo" />
          <span className="font-bold text-red-600">Movies</span>
        </div>

        <div className="hidden pl-[80px] lg:flex">
          <Search />
        </div>

        <div className="flex space-x-3 lg:space-x-5">
          <button
            className="text-gray-50"
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

      <div className="mt-5 flex justify-center lg:hidden">
        <Search />
      </div>
    </div>
  );
};

export default Header;
