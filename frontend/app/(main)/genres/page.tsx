"use client";

import Link from "next/link";

const GENRES = [
  { id: 28, name: "Action", emoji: "💥" },
  { id: 12, name: "Adventure", emoji: "🗺️" },
  { id: 16, name: "Animation", emoji: "🎨" },
  { id: 35, name: "Comedy", emoji: "😂" },
  { id: 80, name: "Crime", emoji: "🔪" },
  { id: 99, name: "Documentary", emoji: "🎥" },
  { id: 18, name: "Drama", emoji: "🎭" },
  { id: 10751, name: "Family", emoji: "👨‍👩‍👧" },
  { id: 14, name: "Fantasy", emoji: "🧙" },
  { id: 36, name: "History", emoji: "🏛️" },
  { id: 27, name: "Horror", emoji: "👻" },
  { id: 10402, name: "Music", emoji: "🎵" },
  { id: 9648, name: "Mystery", emoji: "🔍" },
  { id: 10749, name: "Romance", emoji: "💕" },
  { id: 878, name: "Sci-Fi", emoji: "🚀" },
  { id: 53, name: "Thriller", emoji: "😰" },
  { id: 10752, name: "War", emoji: "⚔️" },
  { id: 37, name: "Western", emoji: "🤠" },
];

export default function GenresPage() {
  return (
    <div className="px-5 lg:px-7 mt-7 pb-16">
      <h1 className="font-display text-2xl font-bold text-ink">Browse by Genre</h1>
      <p className="mt-1 text-sm text-ink-muted">Pick a genre to discover movies</p>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {GENRES.map((genre) => (
          <Link
            key={genre.id}
            href={`/genres/${genre.id}?name=${encodeURIComponent(genre.name)}`}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-edge bg-surface p-5 shadow-sm hover:border-brand hover:shadow-md transition-all"
          >
            <span className="text-3xl">{genre.emoji}</span>
            <span className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">
              {genre.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
