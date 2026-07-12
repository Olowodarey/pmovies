"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  EyeIcon,
  FaceSmileIcon,
  FireIcon,
  ForwardIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Trending movies", href: "/Trending", icon: FireIcon },
  { name: "Upcoming movies", href: "/upcomingMovies", icon: EyeIcon },
  { name: "Animated movies", href: "/animatiedmovies", icon: FaceSmileIcon },
  { name: "Series", href: "/series", icon: ForwardIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div>
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:overflow-y-auto lg:px-6">
        <nav className="flex-1 mt-[300px]">
          <ul role="list" className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link href={item.href} passHref>
                  <div
                    className={classNames(
                      pathname === item.href
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white",
                      "group flex items-center px-4 py-3 text-sm font-medium rounded-md"
                    )}
                  >
                    
                    <div className="flex items-center  space-x-5 ">
                      <item.icon className="h-5 w-5  text-gray-400 flex items-center" aria-hidden="true"  />
                      <span className="whitespace-nowrap text-[17px] mt-2  ">{item.name}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
