"use client";

import { useEffect, useState } from "react";
import {
  BookmarkIcon,
  FilmIcon,
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { IoClose } from "react-icons/io5";

const STORAGE_KEY = "pmovies_seen_welcome_v1";

interface Slide {
  title: string;
  description: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const slides: Slide[] = [
  {
    title: "Welcome to Movies",
    description:
      "Your personal space to track every film and show. Save what you want to see, remember everything you've watched.",
    Icon: SparklesIcon,
  },
  {
    title: "Discover what's next",
    description:
      "Browse Trending right now, Upcoming releases, TV Series and Animated picks — all curated in one place.",
    Icon: FilmIcon,
  },
  {
    title: "Build your watchlist",
    description:
      "Tap the bookmark on any title to save it for later. Mark it as watched once you've seen it and keep your library tidy.",
    Icon: BookmarkIcon,
  },
  {
    title: "Rate & revisit",
    description:
      "Give each watched title a star rating and revisit your history any time from your profile.",
    Icon: StarIcon,
  },
];

const WelcomeModal = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(STORAGE_KEY);
    if (!seen) setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const dismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
    setOpen(false);
  };

  if (!open) return null;

  const slide = slides[step];
  const { Icon } = slide;
  const isLast = step === slides.length - 1;
  const isFirst = step === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close welcome"
        onClick={dismiss}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md">
        {/* Gradient border wrapper */}
        <div className="rounded-3xl bg-gradient-to-br from-brand via-brand/40 to-brand/10 p-[1.5px] shadow-2xl">
          <div className="rounded-3xl bg-surface overflow-hidden">
            {/* Header */}
            <div className="relative px-6 pt-6">
              <button
                type="button"
                onClick={dismiss}
                aria-label="Skip"
                className="absolute right-4 top-4 text-ink-muted hover:text-ink transition-colors"
              >
                <IoClose className="h-6 w-6" />
              </button>
            </div>

            {/* Illustration */}
            <div className="flex justify-center pt-2 pb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-brand/20 blur-2xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover text-brand-contrast shadow-lg">
                  <Icon className="h-11 w-11" strokeWidth={1.6} />
                </div>
              </div>
            </div>

            {/* Text */}
            <div
              key={step}
              className="px-8 pb-2 text-center animate-[fadeIn_.35s_ease-out]"
            >
              <h2
                id="welcome-title"
                className="font-display text-2xl sm:text-3xl font-bold text-ink"
              >
                {slide.title}
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-muted">
                {slide.description}
              </p>
            </div>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStep(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? "w-6 bg-brand" : "w-1.5 bg-edge hover:bg-ink-muted"
                  }`}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3 px-6 py-6">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={isFirst}
                className="text-sm font-medium text-ink-muted hover:text-ink transition-colors disabled:opacity-0 disabled:pointer-events-none"
              >
                Back
              </button>

              {!isLast ? (
                <button
                  type="button"
                  onClick={dismiss}
                  className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
                >
                  Skip
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={() =>
                  isLast ? dismiss() : setStep((s) => Math.min(slides.length - 1, s + 1))
                }
                className="inline-flex items-center gap-1 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-contrast shadow-sm hover:bg-brand-hover transition-colors"
              >
                {isLast ? "Get started" : "Next"}
                {!isLast && <span aria-hidden>→</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;
