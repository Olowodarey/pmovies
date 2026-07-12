"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import logo from "@/app/public/logo.png";
import { FaSun, FaMoon } from "react-icons/fa";
import MobileNavbar from "./mobileNav";
import Search from "./scarch";

const Header = () => {
  const { theme, setTheme } = useTheme();

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
            onClick={() =>
              setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))
            }
          >
            {theme === "dark" ? (
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
