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
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:overflow-y-auto lg:px-6">
        <nav className="flex-1 mt-[300px]">
          <div className="bg-surface border border-edge rounded-2xl shadow-sm p-4">
            <p className="px-2 mb-3 text-xs font-semibold uppercase tracking-widest text-ink-muted">
              Browse
            </p>
            <ul role="list" className="space-y-1.5">
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
                          "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
                        )}
                      >
                        <span
                          className={classNames(
                            isActive
                              ? "bg-transparent text-brand-contrast"
                              : "bg-surface-alt text-ink-muted group-hover:text-brand",
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200"
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
