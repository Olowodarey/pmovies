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
          <ul role="list" className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link href={item.href}>
                  <div
                    className={classNames(
                      pathname === item.href
                        ? "bg-brand text-brand-contrast"
                        : "text-ink-muted hover:bg-surface-hover hover:text-ink",
                      "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <item.icon
                        className={classNames(
                          pathname === item.href
                            ? "text-brand-contrast"
                            : "text-ink-muted group-hover:text-ink",
                          "h-5 w-5 flex items-center"
                        )}
                        aria-hidden="true"
                      />
                      <span className="whitespace-nowrap text-[15px]">{item.name}</span>
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
