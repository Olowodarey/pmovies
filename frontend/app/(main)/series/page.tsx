"use client";

import { useState } from "react";
import { useFetchSeriesQuery } from "@/app/_services/fetchquerry";
import SeriesCard from "@/app/_component/SeriesCard";
import Loading from "@/app/Loading";

export default function SeriesPage() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useFetchSeriesQuery(page);

  return (
    <div className="px-5 lg:px-7 mt-7 pb-16">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📺</span>
        <h1 className="font-display text-2xl font-bold text-ink">Top Rated Series</h1>
      </div>

      {isLoading && <div className="flex justify-center mt-20"><Loading /></div>}
      {error && <p className="mt-10 text-center text-danger">Error loading series.</p>}

      {data && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
            {data.results.map((series) => (
              <SeriesCard key={series.id} series={series} />
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
