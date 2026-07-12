"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useGetMeQuery,
  useGetWatchlistQuery,
  useGetWatchedQuery,
  useLogoutMutation,
  useRemoveFromWatchlistMutation,
  useMarkAsWatchedMutation,
  useRemoveWatchedMutation,
  useUpdateWatchedRatingMutation,
} from "@/app/_services/backendApi";
import StatTile from "@/app/_component/StatTile";
import TrackedMovieCard from "@/app/_component/TrackedMovieCard";
import Loading from "@/app/Loading";

type Tab = "watchlist" | "watched";

const ProfilePage = () => {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("watchlist");

  const { data: user, isLoading: meLoading, isError: meError } = useGetMeQuery();
  const { data: watchlist = [] } = useGetWatchlistQuery(undefined, { skip: !user });
  const { data: watched = [] } = useGetWatchedQuery(undefined, { skip: !user });

  const [logout] = useLogoutMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();
  const [markAsWatched] = useMarkAsWatchedMutation();
  const [removeWatched] = useRemoveWatchedMutation();
  const [updateRating] = useUpdateWatchedRatingMutation();

  useEffect(() => {
    if (!meLoading && meError) {
      router.replace("/login");
    }
  }, [meLoading, meError, router]);

  if (meLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  const now = new Date();
  const thisMonthCount = watched.filter((w) => {
    const d = new Date(w.watchedAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const initials = (user.name || user.email).slice(0, 2).toUpperCase();
  const joinDate = new Date(user.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const items = tab === "watchlist" ? watchlist : watched;

  return (
    <div className="px-5 lg:px-7 mt-7">
      {/* Profile header */}
      <div className="flex items-center gap-4 border-2 border-gray-800 rounded-md p-4">
        <div className="h-16 w-16 shrink-0 rounded-full bg-blue-700 flex items-center justify-center text-xl font-bold">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-bold">{user.name || user.email}</h1>
          <p className="text-sm text-gray-400">Member since {joinDate}</p>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="ml-auto text-sm text-red-500"
        >
          Log out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <StatTile label="Watched" value={watched.length} />
        <StatTile label="Watchlist" value={watchlist.length} />
        <StatTile label="This Month" value={thisMonthCount} />
      </div>

      {/* Tabs */}
      <div className="flex border border-gray-400 rounded-full mt-8 w-fit">
        <button
          type="button"
          className={`px-4 py-1 text-sm rounded-full transition-all ${
            tab === "watchlist" ? "bg-blue-700 text-white" : "text-gray-600"
          }`}
          onClick={() => setTab("watchlist")}
        >
          Watchlist
        </button>
        <button
          type="button"
          className={`px-4 py-1 text-sm rounded-full transition-all ${
            tab === "watched" ? "bg-blue-700 text-white" : "text-gray-600"
          }`}
          onClick={() => setTab("watched")}
        >
          Watched
        </button>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center text-center">
          <p className="text-gray-400">
            {tab === "watchlist"
              ? "Your watchlist is empty."
              : "You haven't marked anything as watched yet."}
          </p>
          <Link href="/" className="mt-4 bg-blue-600 px-4 py-2 rounded-3xl text-sm">
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
          {tab === "watchlist"
            ? watchlist.map((item) => (
                <TrackedMovieCard
                  key={item.id}
                  item={item}
                  variant="watchlist"
                  onRemove={() =>
                    removeFromWatchlist({ tmdbId: item.tmdbId, mediaType: item.mediaType })
                  }
                  onMarkWatched={() =>
                    markAsWatched({
                      tmdbId: item.tmdbId,
                      mediaType: item.mediaType,
                      title: item.title,
                      posterPath: item.posterPath,
                    })
                  }
                />
              ))
            : watched.map((item) => (
                <TrackedMovieCard
                  key={item.id}
                  item={item}
                  variant="watched"
                  onRemove={() => removeWatched(item.id)}
                  onRate={(rating) => updateRating({ id: item.id, rating })}
                />
              ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
