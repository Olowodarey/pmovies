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
  { name: "Animatied movies", href: "/animatiedmovies", icon: FaceSmileIcon },
  { name: "Series", href: "/series", icon: ForwardIcon },
];
const teams = [
  { id: 1, name: "Heroicons", href: "/heroicons", initial: "H" },
  { id: 2, name: "Tailwind Labs", href: "/tailwind-labs", initial: "T" },
  { id: 3, name: "Workcation", href: "/workcation", initial: "W" },
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
          <ul role="list" className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link href={item.href} passHref>
                  <div
                    className={classNames(
                      pathname === item.href
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
                  >
                    <item.icon
                      className="mr-3 h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                    {item.name}
                    {item.count ? (
                      <span className="ml-auto inline-block py-0.5 px-3 text-xs font-medium bg-gray-700 rounded-full text-gray-300">
                        {item.count}
                      </span>
                    ) : null}
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
