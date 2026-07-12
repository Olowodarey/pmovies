"use client";
import banner from "@/app/public/banner.png";
import Image from "next/image";
import Link from "next/link";
import { FaRegCalendarTimes } from "react-icons/fa";
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

const formatCurrency = (amount: number) => {
  return amount ? `$${amount.toLocaleString()}` : "N/A";
};

const Moviedetails = ({ movie, trailer }: MoviedetailsProps) => {
  const {
    title,
    overview,
    runtime,
    release_date,
    genres,
    poster_path,
    revenue,
    budget,
  } = movie;

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  const formattedRuntime = `${hours}h ${minutes}m`;

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
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex flex-col     lg:grid lg:grid-cols-2  ">
          {/* Image gallery */}
          <div className="relative h-[400px] w-full sm:w-[400px] sm:h-[500px] overflow-hidden rounded-lg bg-gray-500 flex items-center justify-center">
            <Image
              src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : banner}
              alt={title}
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className=" text-xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            <div className="grid items-center space-y-1 lg:space-y-0 px-1 lg:flex mt-2 lg:space-x-4">
              <p className="flex  space-x-1 text-sm font-medium">
                <FaRegCalendarTimes />
                <span>{release_date}</span>
              </p>
              <p className="flex items-center space-x-1 text-sm font-medium">
                <span>Genre: {genres.map((genre) => genre.name).join(",")}</span>
              </p>
              <p className="flex items-center space-x-2 text-sm font-medium">
                <span>Duration: {formattedRuntime}</span>
              </p>
            </div>
            <p className="mt-4 text-sm">{overview}</p>
            <div className="flex text-sm space-x-4 mt-4">
              <p>Budget: {formatCurrency(budget)}</p>
              <p>Revenue: {formatCurrency(revenue)}</p>
            </div>

            {user ? (
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  type="button"
                  onClick={() =>
                    inWatchlist
                      ? removeFromWatchlist({ tmdbId: movie.id, mediaType: "MOVIE" })
                      : addToWatchlist(trackableMovie)
                  }
                  className={`px-3 py-1 rounded-3xl text-sm ${
                    inWatchlist ? "bg-gray-700 text-white" : "bg-blue-600 text-white"
                  }`}
                >
                  {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
                </button>
                <button
                  type="button"
                  disabled={isWatched}
                  onClick={() => markAsWatched(trackableMovie)}
                  className="px-3 py-1 rounded-3xl text-sm bg-gray-700 text-white disabled:opacity-60"
                >
                  {isWatched ? "✓ Watched" : "Mark as Watched"}
                </button>
              </div>
            ) : (
              <p className="mt-4 text-sm">
                <Link href="/login" className="text-blue-500">
                  Log in
                </Link>{" "}
                to add this to your watchlist or mark it as watched.
              </p>
            )}

            {trailer && (
              <div className="flex justify-center mt-5">
                <iframe
                  className="rounded-lg shadow-lg w-full sm:w-[600px] h-[200px] sm:h-[260px]"
                  src={`https://www.youtube.com/embed/${trailer}?autoplay=1`}
                  title="Movie Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Moviedetails;
