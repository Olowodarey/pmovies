"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import banner from "@/app/public/banner.png";
import {
  useFetchPopularPeopleQuery,
  useFetchSearchPersonQuery,
  useFetchPersonDetailsQuery,
  useFetchPersonMovieCreditsQuery,
} from "@/app/_services/fetchquerry";
import MovieCard from "@/app/_component/movieCard";
import Loading from "@/app/Loading";
import type { Person } from "@/app/_types/tmdb";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function calcAge(birthday: string | null, deathday: string | null): number | null {
  if (!birthday) return null;
  const end = deathday ? new Date(deathday) : new Date();
  const born = new Date(birthday);
  const age = end.getFullYear() - born.getFullYear();
  const m = end.getMonth() - born.getMonth();
  return m < 0 || (m === 0 && end.getDate() < born.getDate()) ? age - 1 : age;
}

function genderLabel(g: number) {
  if (g === 1) return "Female";
  if (g === 2) return "Male";
  if (g === 3) return "Non-binary";
  return null;
}

// ─── Person card ──────────────────────────────────────────────────────────────
const PersonCard = ({ person, onClick }: { person: Person; onClick: () => void }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileTap={{ scale: 0.96 }}
    className="flex flex-col items-center gap-2 rounded-2xl border-2 border-edge bg-surface p-3 shadow-sm active:border-brand w-full text-center hover:border-brand hover:shadow-md transition-all"
  >
    <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden ring-2 ring-edge shadow">
      <Image
        src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : banner}
        alt={person.name}
        fill
        className="object-cover"
      />
    </div>
    <div className="w-full">
      <p className="text-xs font-semibold text-ink line-clamp-2 leading-tight">{person.name}</p>
      <p className="text-[10px] text-ink-muted mt-0.5">{person.known_for_department}</p>
    </div>
  </motion.button>
);

// ─── Person detail ────────────────────────────────────────────────────────────
const PersonDetail = ({ personId, onBack }: { personId: number; onBack: () => void }) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const { data: details, isLoading: ld } = useFetchPersonDetailsQuery(personId);
  const { data: credits, isLoading: lc } = useFetchPersonMovieCreditsQuery(personId);

  if (ld || lc) return <div className="flex justify-center mt-16"><Loading /></div>;
  if (!details) return null;

  const age = calcAge(details.birthday, details.deathday);
  const topMovies = credits
    ? [...credits.cast].sort((a, b) => b.popularity - a.popularity).slice(0, 12)
    : [];
  const notableCrew = credits
    ? credits.crew
        .filter((c) => ["Director", "Writer", "Screenplay", "Producer"].includes(c.job))
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 8)
    : [];

  const BIO_LIMIT = 350;
  const bioText =
    details.biography && details.biography.length > BIO_LIMIT && !showFullBio
      ? details.biography.slice(0, BIO_LIMIT) + "…"
      : details.biography;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-brand transition-colors mb-5 py-2"
      >
        ← Back
      </button>

      {/* Profile hero — horizontal on all sizes */}
      <div className="flex gap-4 bg-surface border-2 border-edge rounded-2xl p-4 shadow-md">
        {/* Photo */}
        <div className="relative w-24 h-32 sm:w-36 sm:h-48 flex-shrink-0 rounded-xl overflow-hidden border-2 border-edge shadow">
          <Image
            src={details.profile_path ? `https://image.tmdb.org/t/p/w342${details.profile_path}` : banner}
            alt={details.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-base sm:text-2xl font-bold text-ink leading-tight line-clamp-2">
              {details.name}
            </h2>
            {/* Badges */}
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="rounded-full bg-brand/10 border border-brand/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-brand">
                {details.known_for_department}
              </span>
              {genderLabel(details.gender) && (
                <span className="rounded-full bg-surface-alt border border-edge px-2 py-0.5 text-[10px] sm:text-xs text-ink-muted">
                  {genderLabel(details.gender)}
                </span>
              )}
              {details.deathday && (
                <span className="rounded-full bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-2 py-0.5 text-[10px] sm:text-xs text-red-600 dark:text-red-400">
                  Deceased
                </span>
              )}
            </div>
          </div>

          {/* Key facts */}
          <div className="mt-3 space-y-1 text-[11px] sm:text-xs text-ink-muted">
            {details.birthday && (
              <p><span className="font-semibold text-ink">Born:</span>{" "}
                {new Date(details.birthday).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                {age !== null && <span className="ml-1 text-ink-muted">({details.deathday ? `died age ${age}` : `age ${age}`})</span>}
              </p>
            )}
            {details.place_of_birth && (
              <p><span className="font-semibold text-ink">From:</span> {details.place_of_birth}</p>
            )}
          </div>

          {/* Links */}
          <div className="mt-3 flex flex-wrap gap-2">
            {details.imdb_id && (
              <a
                href={`https://www.imdb.com/name/${details.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-yellow-400 px-3 py-1 text-[11px] sm:text-xs font-semibold text-yellow-600 dark:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
              >
                IMDb ↗
              </a>
            )}
            {details.homepage && (
              <a
                href={details.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-edge px-3 py-1 text-[11px] sm:text-xs font-semibold text-ink-muted hover:border-brand hover:text-brand transition-colors"
              >
                Site ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Also known as */}
      {details.also_known_as.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="text-xs font-semibold text-ink-muted self-center">Also known as:</span>
          {details.also_known_as.slice(0, 4).map((a) => (
            <span key={a} className="rounded-full bg-surface-alt border border-edge px-2.5 py-0.5 text-xs text-ink-muted">
              {a}
            </span>
          ))}
        </div>
      )}

      {/* Biography */}
      {details.biography && (
        <div className="mt-5">
          <h3 className="font-display text-sm sm:text-base font-bold text-ink mb-2">Biography</h3>
          <div className="bg-surface border-2 border-edge rounded-xl p-4 shadow-sm">
            <p className="text-sm text-ink leading-relaxed">{bioText}</p>
            {details.biography.length > BIO_LIMIT && (
              <button
                type="button"
                onClick={() => setShowFullBio((v) => !v)}
                className="mt-2 text-xs font-semibold text-brand"
              >
                {showFullBio ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Acting credits */}
      {topMovies.length > 0 && (
        <div className="mt-7">
          <h3 className="font-display text-sm sm:text-base font-bold text-ink mb-1">As Actor</h3>
          <p className="text-xs text-ink-muted mb-3">Top {topMovies.length} by popularity</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {topMovies.map((movie) => (
              <div key={`cast-${movie.id}`}>
                <MovieCard movie={{ id: movie.id, title: movie.title, poster_path: movie.poster_path, release_date: movie.release_date, vote_average: movie.vote_average, overview: movie.overview }} />
                {movie.character && (
                  <p className="mt-1 text-center text-[10px] text-ink-muted italic truncate">as {movie.character}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crew credits */}
      {notableCrew.length > 0 && (
        <div className="mt-7">
          <h3 className="font-display text-sm sm:text-base font-bold text-ink mb-3">Behind the Camera</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {notableCrew.map((movie) => (
              <div key={`crew-${movie.id}-${movie.job}`}>
                <MovieCard movie={{ id: movie.id, title: movie.title, poster_path: movie.poster_path, release_date: movie.release_date, vote_average: movie.vote_average, overview: movie.overview }} />
                <p className="mt-1 text-center text-[10px] text-brand font-semibold truncate">{movie.job}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PeoplePage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: page1 } = useFetchPopularPeopleQuery(1);
  const { data: page2 } = useFetchPopularPeopleQuery(2);
  const { data: page3 } = useFetchPopularPeopleQuery(3);

  const { data: searchData, isLoading: searching } = useFetchSearchPersonQuery(search, {
    skip: search.length < 2,
  });

  const popularPeople = useMemo(() => {
    const all = [...(page1?.results ?? []), ...(page2?.results ?? []), ...(page3?.results ?? [])];
    return all.sort((a, b) => a.name.localeCompare(b.name));
  }, [page1, page2, page3]);

  const availableLetters = useMemo(
    () => new Set(popularPeople.map((p) => p.name[0].toUpperCase())),
    [popularPeople],
  );

  const displayPeople = useMemo(() => {
    if (search.length >= 2) return searchData?.results ?? [];
    if (activeLetter) return popularPeople.filter((p) => p.name[0].toUpperCase() === activeLetter);
    return popularPeople;
  }, [search, searchData, activeLetter, popularPeople]);

  const handleSearch = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    setSearch(q);
    setActiveLetter(null);
    setSelectedId(null);
  }, [query]);

  const isSearching = search.length >= 2;

  return (
    <div className="mt-6 pb-16 overflow-x-hidden">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="font-display text-xl sm:text-3xl font-bold text-ink">Actors &amp; Filmmakers</h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted px-2">Browse popular people or search for anyone by name</p>
      </div>

      {/* Search bar — full width on mobile */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          placeholder="Search actors, directors…"
          className="flex-1 min-w-0 px-3 py-2.5 border-2 border-edge rounded-xl text-sm bg-surface text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand transition-colors"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="shrink-0 px-4 py-2.5 bg-brand text-brand-contrast rounded-xl text-sm font-semibold hover:bg-brand-hover transition-colors"
        >
          Search
        </button>
        {(search || activeLetter) && (
          <button
            type="button"
            onClick={() => { setSearch(""); setQuery(""); setActiveLetter(null); }}
            className="shrink-0 px-3 py-2.5 rounded-xl border-2 border-edge text-ink-muted hover:text-ink transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedId ? (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PersonDetail personId={selectedId} onBack={() => setSelectedId(null)} />
          </motion.div>
        ) : (
          <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* A–Z strip — full bleed scrollable row */}
            {!isSearching && (
              <div className="overflow-x-auto pb-2 mb-4 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10">
                <div className="flex gap-1.5 w-max">
                  <button
                    type="button"
                    onClick={() => setActiveLetter(null)}
                    className={`h-9 px-3 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                      activeLetter === null ? "bg-brand text-brand-contrast" : "bg-surface-alt border border-edge text-ink-muted"
                    }`}
                  >
                    All
                  </button>
                  {LETTERS.map((letter) => {
                    const has = availableLetters.has(letter);
                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => has && setActiveLetter(letter === activeLetter ? null : letter)}
                        className={`h-9 w-9 shrink-0 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                          activeLetter === letter
                            ? "bg-brand text-brand-contrast shadow"
                            : has
                            ? "bg-surface-alt border border-edge text-ink hover:bg-brand/10 hover:text-brand"
                            : "text-ink-muted/25 cursor-default"
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Count label */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                {isSearching ? `Results for "${search}"` : activeLetter ? `"${activeLetter}"` : "Popular"}
              </p>
              <span className="text-xs text-ink-muted">{displayPeople.length} people</span>
            </div>

            {searching && <div className="flex justify-center mt-12"><Loading /></div>}

            {!searching && displayPeople.length === 0 && (
              <p className="mt-10 text-center text-sm text-ink-muted">
                {isSearching ? `No results for "${search}"` : activeLetter ? `No one with "${activeLetter}" loaded — try searching.` : "Loading…"}
              </p>
            )}

            {!searching && displayPeople.length > 0 && (
              <motion.div
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
              >
                {displayPeople.map((p) => (
                  <motion.div
                    key={p.id}
                    variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 20 } } }}
                  >
                    <PersonCard person={p} onClick={() => setSelectedId(p.id)} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
