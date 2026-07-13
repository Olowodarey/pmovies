"use client";

import { useState } from "react";
import { useFetchTrendingMoviesQuery } from "@/app/_services/fetchquerry";
import MovieCard from "@/app/_component/movieCard";
import Loading from "@/app/Loading";

export default function TrendingPage() {
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("day");
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useFetchTrendingMoviesQuery({ timeWindow, page });

  const handleWindow = (w: "day" | "week") => {
    setTimeWindow(w);
    setPage(1);
  };

  return (
    <div className="px-5 lg:px-7 mt-7 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">Trending Movies</h1>
        <div className="flex border border-edge rounded-full w-fit">
          <button
            type="button"
            onClick={() => handleWindow("day")}
            className={`px-4 py-1 text-sm rounded-full transition-colors ${
              timeWindow === "day" ? "bg-brand text-brand-contrast" : "text-ink-muted hover:text-ink"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleWindow("week")}
            className={`px-4 py-1 text-sm rounded-full transition-colors ${
              timeWindow === "week" ? "bg-brand text-brand-contrast" : "text-ink-muted hover:text-ink"
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {isLoading && <div className="flex justify-center mt-20"><Loading /></div>}
      {error && <p className="mt-10 text-center text-danger">Error loading trending movies.</p>}

      {data && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
            {data.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-1.5 rounded-full border border-edge text-sm text-ink-muted hover:text-ink disabled:opacity-40 transition-colors"
            >
              ← Prev
            </button>
            <span className="text-sm text-ink-muted">Page {page} of {data.total_pages}</span>
            <button
              type="button"
              disabled={page >= data.total_pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-1.5 rounded-full border border-edge text-sm text-ink-muted hover:text-ink disabled:opacity-40 transition-colors"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
