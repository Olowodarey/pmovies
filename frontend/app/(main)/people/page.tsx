"use client";

import { useState } from "react";
import Image from "next/image";
import banner from "@/app/public/banner.png";
import {
  useFetchSearchPersonQuery,
  useFetchPersonMoviesQuery,
} from "@/app/_services/fetchquerry";
import MovieCard from "@/app/_component/movieCard";
import Loading from "@/app/Loading";
import type { Person } from "@/app/_types/tmdb";

export default function PeoplePage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Person | null>(null);

  const { data: peopleData, isLoading: searching } = useFetchSearchPersonQuery(search, {
    skip: search.length < 2,
  });
  const { data: moviesData, isLoading: loadingMovies } = useFetchPersonMoviesQuery(
    selected?.id ?? 0,
    { skip: !selected },
  );

  const handleSearch = () => {
    setSearch(query.trim());
    setSelected(null);
  };

  return (
    <div className="px-5 lg:px-7 mt-7 pb-16">
      <div className="text-center">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Search by Actor / Director</h1>
        <p className="mt-1 text-sm text-ink-muted">Find all movies featuring a specific person</p>
      </div>

      <div className="mt-5 flex gap-2 max-w-md mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g. Christopher Nolan"
          className="flex-1 p-2 border border-edge rounded-md text-sm bg-surface text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-brand"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 bg-brand text-brand-contrast rounded-md text-sm font-medium hover:bg-brand-hover transition-colors"
        >
          Search
        </button>
      </div>

      {searching && <div className="flex justify-center mt-12"><Loading /></div>}

      {/* Person results */}
      {!selected && peopleData && peopleData.results.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {peopleData.results.slice(0, 8).map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => setSelected(person)}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-edge bg-surface p-4 hover:border-brand hover:shadow-md transition-all text-left"
            >
              <div className="relative h-24 w-24 rounded-full overflow-hidden bg-surface-alt flex-shrink-0">
                <Image
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                      : banner
                  }
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors text-center line-clamp-2">
                {person.name}
              </p>
              <p className="text-xs text-ink-muted">{person.known_for_department}</p>
            </button>
          ))}
        </div>
      )}

      {!selected && peopleData && peopleData.results.length === 0 && search.length > 0 && (
        <p className="mt-10 text-center text-ink-muted">No people found for &quot;{search}&quot;</p>
      )}

      {/* Selected person's movies */}
      {selected && (
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-5">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              ← Back
            </button>
            <h2 className="font-display text-xl font-bold text-ink">
              Movies featuring {selected.name}
            </h2>
          </div>

          {loadingMovies && <div className="flex justify-center mt-12"><Loading /></div>}

          {moviesData && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
              {moviesData.results.slice(0, 20).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
