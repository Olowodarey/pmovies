"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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
  color: string; // accent used for the icon glow on hover
}

const navigation: NavigationItem[] = [
  { name: "Home",      href: "/",              icon: HomeIcon,              color: "#d4a537" },
  { name: "Trending",  href: "/Trending",       icon: FireIcon,              color: "#ef4444" },
  { name: "Upcoming",  href: "/upcomingMovies", icon: EyeIcon,               color: "#3b82f6" },
  { name: "Top Rated", href: "/top-rated",      icon: StarIcon,              color: "#f59e0b" },
  { name: "Animated",  href: "/animatiedmovies",icon: FaceSmileIcon,         color: "#8b5cf6" },
  { name: "Series",    href: "/series",         icon: ForwardIcon,           color: "#10b981" },
  { name: "Genres",    href: "/genres",         icon: TagIcon,               color: "#ec4899" },
  { name: "People",    href: "/people",         icon: UserGroupIcon,         color: "#06b6d4" },
  { name: "About",     href: "/about",          icon: InformationCircleIcon, color: "#6366f1" },
];

// stagger children in the list
const listVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -18 },
  show:   { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 lg:overflow-y-auto lg:px-4">
      <nav className="flex-1 mt-[190px]">
        {/* Card with gradient border */}
        <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-b from-brand/60 via-brand/20 to-transparent shadow-xl">
          <div className="rounded-2xl bg-surface p-5">

            {/* Header */}
            <div className="flex items-center gap-2 px-2 mb-5">
              <motion.span
                className="h-2 w-2 rounded-full bg-brand"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink-muted">
                Browse
              </p>
            </div>

            {/* Nav items */}
            <motion.ul
              role="list"
              className="space-y-1"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {navigation.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <motion.li key={item.name} variants={itemVariants}>
                    <Link href={item.href} className="block">
                      <motion.div
                        className="relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl cursor-pointer select-none"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      >
                        {/* Animated background pill for active */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.span
                              layoutId="active-pill"
                              className="absolute inset-0 rounded-xl bg-brand shadow-md"
                              initial={{ opacity: 0, scale: 0.92 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.92 }}
                              transition={{ type: "spring", stiffness: 380, damping: 28 }}
                            />
                          )}
                        </AnimatePresence>

                        {/* Icon box */}
                        <motion.span
                          className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                            isActive
                              ? "bg-white/15 text-brand-contrast"
                              : "bg-surface-alt text-ink-muted"
                          }`}
                          whileHover={
                            !isActive
                              ? { backgroundColor: item.color + "22", color: item.color, scale: 1.12 }
                              : {}
                          }
                          transition={{ duration: 0.18 }}
                        >
                          <item.icon className="h-5 w-5" aria-hidden="true" />
                        </motion.span>

                        {/* Label */}
                        <span
                          className={`relative z-10 whitespace-nowrap text-[15px] font-medium transition-colors duration-150 ${
                            isActive ? "text-brand-contrast" : "text-ink-muted"
                          }`}
                        >
                          {item.name}
                        </span>

                        {/* Active dot on the right */}
                        {isActive && (
                          <motion.span
                            layoutId="active-dot"
                            className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-brand-contrast/70"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>

            {/* Bottom divider + version tag */}
            <div className="mt-5 pt-4 border-t border-edge flex items-center justify-between px-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted/50">
                Movies
              </span>
              <motion.span
                className="text-[10px] text-ink-muted/40"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                v1.0
              </motion.span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
