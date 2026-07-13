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
  StarIcon,
  TagIcon,
  UserGroupIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigation: NavigationItem[] = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Trending", href: "/Trending", icon: FireIcon },
  { name: "Upcoming", href: "/upcomingMovies", icon: EyeIcon },
  { name: "Top Rated", href: "/top-rated", icon: StarIcon },
  { name: "Animated", href: "/animatiedmovies", icon: FaceSmileIcon },
  { name: "Series", href: "/series", icon: ForwardIcon },
  { name: "Genres", href: "/genres", icon: TagIcon },
  { name: "People", href: "/people", icon: UserGroupIcon },
  { name: "About", href: "/about", icon: InformationCircleIcon },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MobileNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      <div className="lg:hidden flex justify-end">
        <button onClick={() => setMobileOpen(true)} className="text-ink-muted">
          <IoIosMenu size={35} />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-[240px] w-full bg-surface border-r border-edge overflow-y-auto">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
                onClick={() => setMobileOpen(false)}
              >
                <ImCancelCircle className="h-6 w-6 text-ink" />
              </button>
            </div>
            <nav className="flex-1 pt-6 pb-4 px-3">
              <ul role="list" className="space-y-1">
                {navigation.map((item) => {
                  const isActive =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <li key={item.name}>
                      <Link href={item.href} onClick={() => setMobileOpen(false)}>
                        <div
                          className={classNames(
                            isActive
                              ? "bg-brand text-brand-contrast"
                              : "text-ink-muted hover:bg-surface-hover hover:text-ink",
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-colors"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              isActive ? "text-brand-contrast" : "text-ink-muted",
                              "mr-3 h-5 w-5"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
