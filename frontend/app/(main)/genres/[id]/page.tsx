"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useFetchMoviesByGenreQuery } from "@/app/_services/fetchquerry";
import MovieCard from "@/app/_component/movieCard";
import Loading from "@/app/Loading";

const DECADES = [
  { label: "All time", value: undefined },
  { label: "2020s", value: 2020 },
  { label: "2010s", value: 2010 },
  { label: "2000s", value: 2000 },
  { label: "1990s", value: 1990 },
  { label: "1980s", value: 1980 },
  { label: "1970s", value: 1970 },
];

export default function GenreMoviesPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const genreName = searchParams.get("name") ?? "Genre";
  const [decade, setDecade] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useFetchMoviesByGenreQuery({
    genreId: Number(id),
    decade,
    page,
  });

  return (
    <div className="px-5 lg:px-7 mt-7 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">{genreName} Movies</h1>

        {/* Decade filter */}
        <div className="flex flex-wrap gap-2">
          {DECADES.map((d) => (
            <button
              key={d.label}
              type="button"
              onClick={() => { setDecade(d.value); setPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                decade === d.value
                  ? "bg-brand text-brand-contrast border-brand"
                  : "border-edge text-ink-muted hover:text-ink"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center mt-20"><Loading /></div>
      )}
      {error && (
        <p className="mt-10 text-center text-danger">Failed to load movies.</p>
      )}

      {data && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
            {data.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-1.5 rounded-full border border-edge text-sm text-ink-muted hover:text-ink disabled:opacity-40 transition-colors"
            >
              ← Prev
            </button>
            <span className="text-sm text-ink-muted">
              Page {page} of {data.total_pages}
            </span>
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
