import Link from "next/link";
import {
  FilmIcon,
  BookmarkIcon,
  EyeIcon,
  StarIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: FilmIcon,
    title: "Discover Movies & Shows",
    description:
      "Browse trending titles, upcoming releases, top-rated films, animated picks, and TV series — all in one place.",
  },
  {
    icon: BookmarkIcon,
    title: "Build Your Watchlist",
    description:
      "Tap the bookmark on any title to save it for later. Your watchlist is always a click away from your profile.",
  },
  {
    icon: EyeIcon,
    title: "Track What You've Watched",
    description:
      "Mark titles as watched as you finish them. Build a full history of everything you've seen.",
  },
  {
    icon: StarIcon,
    title: "Rate & Remember",
    description:
      "Give each watched title a star rating (1–5). Revisit your opinions any time from your profile.",
  },
  {
    icon: ChartBarIcon,
    title: "Personal Stats",
    description:
      "See how many movies you've watched this month, this year, your genre breakdown, and your average rating.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Search by Genre, Decade & Person",
    description:
      "Browse by genre, filter by decade (70s through 2020s), or search for an actor or director to see all their films.",
  },
];

const steps = [
  { step: "01", label: "Browse", detail: "Explore trending, upcoming, top-rated, or browse by genre / decade." },
  { step: "02", label: "Save", detail: "Click any poster and add it to your watchlist with one tap." },
  { step: "03", label: "Watch", detail: "When you're done, mark it as watched directly from the movie page." },
  { step: "04", label: "Rate", detail: "Give it a star rating and it goes into your personal stats." },
];

export default function AboutPage() {
  return (
    <div className="px-5 lg:px-7 mt-7 pb-20 max-w-4xl">
      {/* Hero */}
      <div className="text-center py-10">
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink leading-tight">
          Your personal movie&nbsp;diary
        </h1>
        <p className="mt-4 text-base sm:text-lg text-ink-muted max-w-xl mx-auto leading-relaxed">
          Track every film and show you watch. Save what you want to see next. Understand your
          taste with genre stats, ratings, and monthly activity.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-contrast hover:bg-brand-hover transition-colors shadow"
          >
            Get started — it&apos;s free
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-edge px-6 py-2.5 text-sm font-semibold text-ink hover:bg-surface-hover transition-colors"
          >
            Browse movies
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-ink mb-5">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((s) => (
            <div
              key={s.step}
              className="flex gap-4 rounded-2xl border border-edge bg-surface p-5 shadow-sm"
            >
              <span className="text-3xl font-bold text-brand/30 leading-none font-display">
                {s.step}
              </span>
              <div>
                <p className="font-semibold text-ink">{s.label}</p>
                <p className="text-sm text-ink-muted mt-0.5">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-14">
        <h2 className="font-display text-xl font-bold text-ink mb-5">Everything included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl border border-edge bg-surface p-5 shadow-sm hover:border-brand transition-colors"
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                <Icon className="h-5 w-5 text-brand" strokeWidth={1.8} />
              </span>
              <div>
                <p className="font-semibold text-ink">{title}</p>
                <p className="text-sm text-ink-muted mt-1">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-3xl bg-gradient-to-br from-brand/20 via-brand/10 to-transparent border border-brand/20 p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">Ready to start tracking?</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Free to use. No ads. Just your movies.
        </p>
        <Link
          href="/signup"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-brand px-7 py-2.5 text-sm font-semibold text-brand-contrast hover:bg-brand-hover transition-colors shadow"
        >
          Create your free account
        </Link>
      </div>
    </div>
  );
}
