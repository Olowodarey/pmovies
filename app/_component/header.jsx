"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import Image from "next/image";
import logo from "@/app/public/logo.png";
import { IoBookmarksOutline } from "react-icons/io5";
import { FaSun, FaMoon } from "react-icons/fa";
import MobileNavbar from "./mobileNav";
import Link from "next/link";
import { useFetchSearchMoviesQuery } from "@/app/_services/fetchquerry";
import Loading from "../Loading";
import Search from "./scarch";
import MovieCard from "./movieCard";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="py-2 px-5 lg:px-10 bg-gray-700 ">
      <div className="flex justify-between">
        {/* 1st section */}
        <div className="flex space-x-1 items-center ">
          <Image src={logo} alt="logo" />
          <span className="font-bold text-red-600">Movies</span>
        </div>


        {/* search handle */}

          <div className="hidden lg:flex">
          <Search />
          </div>
    

        {/* 2nd section */}

        <div className="flex space-x-3 lg:space-x-5">
          <button
            className="text-gray-50"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <FaSun className="h-5 w-5" />
            ) : (
              <FaMoon className="h-5 w-5" />
            )}
          </button>

          {/* <Link href={"/watchlist"}>
            <button className="flex items-center space-x-1 bg-gray-800 rounded-lg px-3 p-2 hover:bg-gray-950">
              <IoBookmarksOutline className="h-6 w-6 text-red-600" />
              <span>Watchlist</span>
            </button>
          </Link> */}

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
