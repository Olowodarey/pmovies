"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
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
const PersonCard = ({
  person,
  onClick,
}: {
  person: Person;
  onClick: () => void;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 320, damping: 22 }}
    className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-edge bg-surface p-4 shadow-md hover:shadow-xl hover:border-brand transition-colors w-full text-center"
  >
    <div className="relative h-24 w-24 rounded-full overflow-hidden ring-2 ring-edge group-hover:ring-brand transition-all shadow-md">
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
    <div>
      <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2 leading-snug">
        {person.name}
      </p>
      <p className="text-xs text-ink-muted mt-0.5">{person.known_for_department}</p>
    </div>
  </motion.button>
);

// ─── People grid (animated stagger) ──────────────────────────────────────────
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 20 } },
};

const PeopleGrid = ({
  people,
  onSelect,
}: {
  people: Person[];
  onSelect: (p: Person) => void;
}) => (
  <motion.div
    key="grid"
    variants={gridVariants}
    initial="hidden"
    animate="show"
    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
  >
    {people.map((p) => (
      <motion.div key={p.id} variants={cardVariants}>
        <PersonCard person={p} onClick={() => onSelect(p)} />
      </motion.div>
    ))}
  </motion.div>
);

// ─── Person detail view ───────────────────────────────────────────────────────
const PersonDetail = ({
  personId,
  onBack,
}: {
  personId: number;
  onBack: () => void;
}) => {
  const [showFullBio, setShowFullBio] = useState(false);

  const { data: details, isLoading: loadingDetails } = useFetchPersonDetailsQuery(personId);
  const { data: credits, isLoading: loadingCredits } = useFetchPersonMovieCreditsQuery(personId);

  if (loadingDetails || loadingCredits) {
    return (
      <div className="flex justify-center mt-20">
        <Loading />
      </div>
    );
  }

  if (!details) return null;

  const age = calcAge(details.birthday, details.deathday);

  // top cast credits sorted by popularity
  const topMovies = credits
    ? [...credits.cast]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 16)
    : [];

  // notable directing / writing credits
  const notableCrew = credits
    ? credits.crew
        .filter((c) => ["Director", "Writer", "Screenplay", "Producer"].includes(c.job))
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 8)
    : [];

  const BIO_LIMIT = 400;
  const bioTrimmed =
    details.biography && details.biography.length > BIO_LIMIT && !showFullBio
      ? details.biography.slice(0, BIO_LIMIT) + "…"
      : details.biography;

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
    >
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand transition-colors mb-6"
      >
        <span>←</span> Back to people
      </button>

      {/* Profile card */}
      <div className="flex flex-col sm:flex-row gap-6 bg-surface border-2 border-edge rounded-2xl shadow-lg p-6">
        {/* Photo */}
        <div className="relative mx-auto sm:mx-0 w-36 h-44 sm:w-44 sm:h-56 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-edge shadow-md">
          <Image
            src={
              details.profile_path
                ? `https://image.tmdb.org/t/p/w342${details.profile_path}`
                : banner
            }
            alt={details.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            {details.name}
          </h2>
          <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="rounded-full bg-brand/10 border border-brand/20 px-3 py-0.5 text-xs font-semibold text-brand">
              {details.known_for_department}
            </span>
            {genderLabel(details.gender) && (
              <span className="rounded-full bg-surface-alt border border-edge px-3 py-0.5 text-xs text-ink-muted">
                {genderLabel(details.gender)}
              </span>
            )}
            {details.deathday && (
              <span className="rounded-full bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-0.5 text-xs text-red-600 dark:text-red-400">
                Deceased
              </span>
            )}
          </div>

          {/* Stats grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {details.birthday && (
              <div className="rounded-xl bg-surface-alt border border-edge p-3 text-center">
                <p className="text-xs text-ink-muted uppercase tracking-wider">Born</p>
                <p className="text-sm font-semibold text-ink mt-0.5">
                  {new Date(details.birthday).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
            {age !== null && (
              <div className="rounded-xl bg-surface-alt border border-edge p-3 text-center">
                <p className="text-xs text-ink-muted uppercase tracking-wider">
                  {details.deathday ? "Age at death" : "Age"}
                </p>
                <p className="text-sm font-semibold text-ink mt-0.5">{age}</p>
              </div>
            )}
            {details.place_of_birth && (
              <div className="rounded-xl bg-surface-alt border border-edge p-3 text-center col-span-2 sm:col-span-1">
                <p className="text-xs text-ink-muted uppercase tracking-wider">Birthplace</p>
                <p className="text-sm font-semibold text-ink mt-0.5 line-clamp-2">
                  {details.place_of_birth}
                </p>
              </div>
            )}
          </div>

          {/* External links */}
          <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
            {details.imdb_id && (
              <a
                href={`https://www.imdb.com/name/${details.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-yellow-400 px-4 py-1 text-xs font-semibold text-yellow-600 dark:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
              >
                IMDb ↗
              </a>
            )}
            {details.homepage && (
              <a
                href={details.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-edge px-4 py-1 text-xs font-semibold text-ink-muted hover:border-brand hover:text-brand transition-colors"
              >
                Official Site ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Biography */}
      {details.biography && (
        <div className="mt-6">
          <h3 className="font-display text-lg font-bold text-ink mb-2">Biography</h3>
          <div className="bg-surface border-2 border-edge rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-ink leading-relaxed whitespace-pre-line">{bioTrimmed}</p>
            {details.biography.length > BIO_LIMIT && (
              <button
                type="button"
                onClick={() => setShowFullBio((v) => !v)}
                className="mt-3 text-xs font-semibold text-brand hover:text-brand-hover transition-colors"
              >
                {showFullBio ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Also known as */}
      {details.also_known_as.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
            Also known as
          </p>
          <div className="flex flex-wrap gap-2">
            {details.also_known_as.slice(0, 6).map((alias) => (
              <span
                key={alias}
                className="rounded-full bg-surface-alt border border-edge px-3 py-0.5 text-xs text-ink-muted"
              >
                {alias}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top movie credits */}
      {topMovies.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-lg font-bold text-ink mb-1">
            Movies as Actor
          </h3>
          <p className="text-xs text-ink-muted mb-4">
            Top {topMovies.length} roles by popularity
          </p>
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-4 lg:gap-x-3"
          >
            {topMovies.map((movie) => (
              <motion.div key={`cast-${movie.id}`} variants={cardVariants}>
                <div className="relative">
                  <MovieCard
                    movie={{
                      id: movie.id,
                      title: movie.title,
                      poster_path: movie.poster_path,
                      release_date: movie.release_date,
                      vote_average: movie.vote_average,
                      overview: movie.overview,
                    }}
                  />
                  {movie.character && (
                    <p className="mt-1 text-center text-[11px] text-ink-muted italic truncate px-1">
                      as {movie.character}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Crew credits */}
      {notableCrew.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-lg font-bold text-ink mb-4">
            Behind the Camera
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-4 lg:gap-x-3">
            {notableCrew.map((movie) => (
              <div key={`crew-${movie.id}-${movie.job}`} className="relative">
                <MovieCard
                  movie={{
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    overview: movie.overview,
                  }}
                />
                <p className="mt-1 text-center text-[11px] text-brand font-semibold truncate px-1">
                  {movie.job}
                </p>
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

  // Load 3 pages of popular people in parallel
  const { data: page1 } = useFetchPopularPeopleQuery(1);
  const { data: page2 } = useFetchPopularPeopleQuery(2);
  const { data: page3 } = useFetchPopularPeopleQuery(3);

  // Search
  const { data: searchData, isLoading: searching } = useFetchSearchPersonQuery(search, {
    skip: search.length < 2,
  });

  // Merged + sorted popular people
  const popularPeople = useMemo(() => {
    const all = [
      ...(page1?.results ?? []),
      ...(page2?.results ?? []),
      ...(page3?.results ?? []),
    ];
    return all.sort((a, b) => a.name.localeCompare(b.name));
  }, [page1, page2, page3]);

  // Letters that have at least one person loaded
  const availableLetters = useMemo(
    () => new Set(popularPeople.map((p) => p.name[0].toUpperCase())),
    [popularPeople],
  );

  // Which people to show in the grid
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

  const handleSelect = useCallback((p: Person) => {
    setSelectedId(p.id);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedId(null);
  }, []);

  const isSearching = search.length >= 2;

  return (
    <div className="px-5 lg:px-7 mt-7 pb-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Actors &amp; Filmmakers
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Browse popular people or search for anyone by name
        </p>
      </div>

      {/* Search */}
      <div className="mt-5 flex gap-2 max-w-md mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Search actors, directors…"
          className="flex-1 p-2.5 border-2 border-edge rounded-xl text-sm bg-surface text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand transition-colors"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-5 py-2.5 bg-brand text-brand-contrast rounded-xl text-sm font-semibold hover:bg-brand-hover transition-colors shadow-sm"
        >
          Search
        </button>
        {(search || activeLetter) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setQuery("");
              setActiveLetter(null);
            }}
            className="px-3 py-2.5 rounded-xl border-2 border-edge text-sm text-ink-muted hover:text-ink transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedId ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            <PersonDetail personId={selectedId} onBack={handleBack} />
          </motion.div>
        ) : (
          <motion.div
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* A–Z strip (only when not searching) */}
            {!isSearching && (
              <div className="mt-6 overflow-x-auto pb-1">
                <div className="flex gap-1 min-w-max mx-auto w-fit">
                  {/* All button */}
                  <button
                    type="button"
                    onClick={() => setActiveLetter(null)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      activeLetter === null
                        ? "bg-brand text-brand-contrast"
                        : "bg-surface-alt text-ink-muted hover:text-ink border border-edge"
                    }`}
                  >
                    All
                  </button>
                  {LETTERS.map((letter) => {
                    const has = availableLetters.has(letter);
                    return (
                      <motion.button
                        key={letter}
                        type="button"
                        onClick={() => has && setActiveLetter(letter === activeLetter ? null : letter)}
                        whileHover={has ? { scale: 1.15 } : {}}
                        whileTap={has ? { scale: 0.9 } : {}}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                          activeLetter === letter
                            ? "bg-brand text-brand-contrast shadow"
                            : has
                            ? "bg-surface-alt text-ink hover:bg-brand/10 hover:text-brand border border-edge"
                            : "text-ink-muted/30 cursor-default"
                        }`}
                      >
                        {letter}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section label */}
            <div className="mt-5 mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                {isSearching
                  ? `Results for "${search}"`
                  : activeLetter
                  ? `Names starting with "${activeLetter}"`
                  : "Popular People"}
              </p>
              <span className="text-xs text-ink-muted">{displayPeople.length} people</span>
            </div>

            {/* Loading */}
            {searching && (
              <div className="flex justify-center mt-12">
                <Loading />
              </div>
            )}

            {/* Empty */}
            {!searching && displayPeople.length === 0 && (
              <p className="mt-10 text-center text-ink-muted">
                {isSearching
                  ? `No results for "${search}"`
                  : activeLetter
                  ? `No popular people loaded with name starting with "${activeLetter}" — try searching instead.`
                  : "Loading…"}
              </p>
            )}

            {/* Grid */}
            {!searching && displayPeople.length > 0 && (
              <PeopleGrid people={displayPeople} onSelect={handleSelect} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
