"use client";
import { useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import { IoIosMenu } from "react-icons/io";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  EyeIcon,
  FaceSmileIcon,
  FireIcon,
  ForwardIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigation: NavigationItem[] = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Trending movies", href: "/Trending", icon: FireIcon },
  { name: "Upcoming movies", href: "/upcomingMovies", icon: EyeIcon },
  { name: "Animatied movies", href: "/animatiedmovies", icon: FaceSmileIcon },
  { name: "Series", href: "/series", icon: ForwardIcon },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MobileNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <div>
      <div className="lg:hidden flex justify-end">
        <button onClick={toggleMobile} className="text-ink-muted">
          {mobileOpen ? <ImCancelCircle className="hidden" /> : <IoIosMenu size={35} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={toggleMobile}></div>
          <div className="relative flex-1 flex flex-col max-w-[220px] w-full bg-surface border-r border-edge">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
                onClick={toggleMobile}
              >
                <ImCancelCircle className="h-6 w-6 text-ink" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <nav className="flex-1 mt-[10px]">
                <ul role="list" className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href}>
                        <div
                          onClick={closeMobileMenu}
                          className={classNames(
                            pathname === item.href
                              ? "bg-brand text-brand-contrast"
                              : "text-ink-muted hover:bg-surface-hover hover:text-ink",
                            "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              pathname === item.href ? "text-brand-contrast" : "text-ink-muted",
                              "mr-3 h-6 w-6"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
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
