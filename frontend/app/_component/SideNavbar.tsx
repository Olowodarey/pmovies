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

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigation: NavigationItem[] = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Trending movies", href: "/Trending", icon: FireIcon },
  { name: "Upcoming movies", href: "/upcomingMovies", icon: EyeIcon },
  { name: "Animated movies", href: "/animatiedmovies", icon: FaceSmileIcon },
  { name: "Series", href: "/series", icon: ForwardIcon },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div>
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 lg:overflow-y-auto lg:px-4">
        <nav className="flex-1 mt-[300px]">
          <div className="bg-surface border border-edge rounded-2xl shadow-lg p-5">
            <div className="flex items-center gap-2 px-2 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
                Browse
              </p>
            </div>
            <ul role="list" className="space-y-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <div
                        className={classNames(
                          isActive
                            ? "bg-brand text-brand-contrast shadow-md"
                            : "text-ink-muted hover:bg-surface-hover hover:text-ink",
                          "group flex items-center gap-3.5 px-3.5 py-3 text-sm font-medium rounded-xl transition-all duration-200"
                        )}
                      >
                        <span
                          className={classNames(
                            isActive
                              ? "bg-white/15 text-brand-contrast"
                              : "bg-surface-alt text-ink-muted group-hover:bg-brand group-hover:text-white group-hover:scale-110",
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-200"
                          )}
                        >
                          <item.icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="whitespace-nowrap text-[15px]">{item.name}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
