"use client";
import { useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import { IoIosMenu } from "react-icons/io";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  EyeIcon,
  FaceSmileIcon,
  FireIcon,
  ForwardIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon,  },
  { name: "Trending movies", href: "/Trending", icon: FireIcon  },
  { name: "Upcoming movies", href: "/upcomingMovies", icon: EyeIcon  },
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

export default function MobileNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div>
      {/* Mobile toggle button */}
      <div className="lg:hidden flex justify-end ">
        <button onClick={toggleMobile} className="text-gray-300">
          {mobileOpen ? <ImCancelCircle size={24} /> : <IoIosMenu size={24} />}
        </button>
      </div>

    

      {/* Sidebar for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobile}></div>
          <div className="relative flex-1 flex flex-col max-w-[220px] w-full bg-gray-900">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleMobile}
              >
                <ImCancelCircle className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
           
            <nav className="flex-1 mt-[10px]">
          <ul role="list" className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link href={item.href} passHref>
                  <div
                    className={classNames(
                      pathname === item.href ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
                  >
                    <item.icon className="mr-3 h-6 w-6 text-gray-400" aria-hidden="true" />
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
        </div>
      )}
    </div>
  );
}
