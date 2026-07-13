"use client";

import Image from "next/image";
import Link from "next/link";
import banner from "@/app/public/banner.png";
import type { MovieDetails as MovieDetailsType } from "@/app/_types/tmdb";
import {
  useGetMeQuery,
  useGetWatchlistQuery,
  useGetWatchedQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useMarkAsWatchedMutation,
} from "@/app/_services/backendApi";

interface MoviedetailsProps {
  movie: MovieDetailsType;
  trailer?: string;
}

const formatCurrency = (n: number) =>
  n ? `$${n.toLocaleString()}` : "N/A";

const langName = (iso: string) => {
  try {
    return new Intl.DisplayNames(["en"], { type: "language" }).of(iso) ?? iso;
  } catch {
    return iso;
  }
};

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3 border-b border-edge last:border-0">
    <span className="w-40 shrink-0 text-xs font-semibold uppercase tracking-widest text-ink-muted">
      {label}
    </span>
    <span className="text-sm text-ink">{value}</span>
  </div>
);

const Moviedetails = ({ movie, trailer }: MoviedetailsProps) => {
  const {
    title,
    tagline,
    overview,
    runtime,
    release_date,
    genres,
    poster_path,
    backdrop_path,
    revenue,
    budget,
    status,
    original_language,
    original_title,
    vote_average,
    vote_count,
    popularity,
    imdb_id,
    homepage,
    spoken_languages,
    production_companies,
    production_countries,
  } = movie;

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  const formattedRuntime = runtime ? `${hours}h ${minutes}m` : "N/A";

  const { data: user } = useGetMeQuery();
  const { data: watchlist = [] } = useGetWatchlistQuery(undefined, { skip: !user });
  const { data: watched = [] } = useGetWatchedQuery(undefined, { skip: !user });
  const [addToWatchlist] = useAddToWatchlistMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();
  const [markAsWatched] = useMarkAsWatchedMutation();

  const inWatchlist = watchlist.some(
    (w) => w.tmdbId === movie.id && w.mediaType === "MOVIE",
  );
  const isWatched = watched.some(
    (w) => w.tmdbId === movie.id && w.mediaType === "MOVIE",
  );

  const trackableMovie = {
    tmdbId: movie.id,
    mediaType: "MOVIE" as const,
    title,
    posterPath: poster_path,
    genreIds: genres.map((g) => g.id),
  };

  return (
    <div className="pb-16">
      {/* Backdrop */}
      {backdrop_path && (
        <div className="relative w-full h-48 sm:h-64 lg:h-80 overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${backdrop_path}`}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Poster + core info */}
        <div className="flex flex-col items-center lg:flex-row lg:items-start gap-8 -mt-20 relative">
          {/* Poster */}
          <div className="relative w-44 sm:w-56 shrink-0 rounded-2xl overflow-hidden border-4 border-surface shadow-2xl">
            <Image
              src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : banner}
              alt={title}
              width={224}
              height={336}
              className="object-cover w-full"
              priority
            />
          </div>

          {/* Core info */}
          <div className="flex-1 text-center lg:text-left pt-4 lg:pt-24">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight">
              {title}
            </h1>
            {original_title && original_title !== title && (
              <p className="mt-1 text-sm text-ink-muted italic">{original_title}</p>
            )}
            {tagline && (
              <p className="mt-2 text-base text-brand italic font-medium">&quot;{tagline}&quot;</p>
            )}

            {/* Meta chips */}
            <div className="mt-3 flex flex-wrap justify-center lg:justify-start gap-2">
              {status && (
                <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                  status === "Released"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}>
                  {status}
                </span>
              )}
              {release_date && (
                <span className="rounded-full bg-surface-alt border border-edge px-3 py-0.5 text-xs font-medium text-ink-muted">
                  {release_date}
                </span>
              )}
              {formattedRuntime !== "N/A" && (
                <span className="rounded-full bg-surface-alt border border-edge px-3 py-0.5 text-xs font-medium text-ink-muted">
                  {formattedRuntime}
                </span>
              )}
              <span className="rounded-full bg-surface-alt border border-edge px-3 py-0.5 text-xs font-medium text-ink-muted uppercase">
                {langName(original_language)}
              </span>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center lg:justify-start gap-2">
                {genres.map((g) => (
                  <Link
                    key={g.id}
                    href={`/genres/${g.id}?name=${encodeURIComponent(g.name)}`}
                    className="rounded-full bg-brand/10 border border-brand/20 px-3 py-0.5 text-xs font-semibold text-brand hover:bg-brand/20 transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Score */}
            <div className="mt-4 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-brand">
                  {vote_average.toFixed(1)}
                </span>
                <span className="text-xs text-ink-muted">
                  ★ {vote_count?.toLocaleString()} votes
                </span>
              </div>
              {popularity && (
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-ink">
                    {Math.round(popularity)}
                  </span>
                  <span className="text-xs text-ink-muted">Popularity</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-3">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      inWatchlist
                        ? removeFromWatchlist({ tmdbId: movie.id, mediaType: "MOVIE" })
                        : addToWatchlist(trackableMovie)
                    }
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                      inWatchlist
                        ? "bg-surface-alt border-2 border-edge text-ink"
                        : "bg-brand text-brand-contrast hover:bg-brand-hover shadow-md"
                    }`}
                  >
                    {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
                  </button>
                  <button
                    type="button"
                    disabled={isWatched}
                    onClick={() => markAsWatched(trackableMovie)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                      isWatched
                        ? "border-edge bg-surface-alt text-ink-muted"
                        : "border-edge text-ink hover:bg-surface-hover"
                    }`}
                  >
                    {isWatched ? "✓ Watched" : "Mark as Watched"}
                  </button>
                </>
              ) : (
                <p className="text-sm text-ink-muted">
                  <Link href="/login" className="text-brand font-semibold">Log in</Link>
                  {" "}to track this movie.
                </p>
              )}

              {imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-full text-sm font-semibold border-2 border-yellow-400 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                >
                  IMDb ↗
                </a>
              )}
              {homepage && (
                <a
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-full text-sm font-semibold border-2 border-edge text-ink-muted hover:text-ink hover:border-brand transition-colors"
                >
                  Official Site ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Overview */}
        {overview && (
          <div className="mt-10 text-center lg:text-left">
            <h2 className="font-display text-lg font-bold text-ink mb-2">Overview</h2>
            <p className="text-sm sm:text-base text-ink leading-relaxed">{overview}</p>
          </div>
        )}

        {/* Trailer */}
        {trailer && (
          <div className="mt-10">
            <h2 className="font-display text-lg font-bold text-ink mb-4 text-center lg:text-left">
              Trailer
            </h2>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border-2 border-edge">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailer}`}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Details table */}
        <div className="mt-10 rounded-2xl border-2 border-edge overflow-hidden shadow-sm">
          <div className="px-5 py-4 bg-surface-alt border-b border-edge">
            <h2 className="font-display text-lg font-bold text-ink">Movie Details</h2>
          </div>
          <div className="px-5 bg-surface divide-y divide-edge">
            <InfoRow label="Status" value={status || "—"} />
            <InfoRow label="Release Date" value={release_date || "—"} />
            <InfoRow label="Runtime" value={formattedRuntime} />
            <InfoRow
              label="Language"
              value={spoken_languages?.map((l) => l.english_name).join(", ") || langName(original_language)}
            />
            <InfoRow label="Budget" value={formatCurrency(budget)} />
            <InfoRow label="Revenue" value={formatCurrency(revenue)} />
            <InfoRow
              label="Production"
              value={
                production_companies?.length
                  ? production_companies.map((c) => c.name).join(", ")
                  : "—"
              }
            />
            <InfoRow
              label="Countries"
              value={
                production_countries?.length
                  ? production_countries.map((c) => c.name).join(", ")
                  : "—"
              }
            />
            <InfoRow
              label="TMDB Score"
              value={`${vote_average.toFixed(1)} / 10  (${vote_count?.toLocaleString()} votes)`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Moviedetails;
