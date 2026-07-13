"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

  const {
    data: user,
    isLoading: meLoading,
    isFetching: meFetching,
    isError: meError,
  } = useGetMeQuery();
  const { data: watchlist = [] } = useGetWatchlistQuery(undefined, { skip: !user });
  const { data: watched = [] } = useGetWatchedQuery(undefined, { skip: !user });

  const [logout] = useLogoutMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();
  const [markAsWatched] = useMarkAsWatchedMutation();
  const [removeWatched] = useRemoveWatchedMutation();
  const [updateRating] = useUpdateWatchedRatingMutation();

  useEffect(() => {
    // Only redirect once the query has actually settled: not on stale errors
    // from a previous unauthenticated fetch that RTK Query is currently
    // refetching after a login-triggered `invalidatesTags: ["Me"]`.
    if (!meLoading && !meFetching && meError && !user) {
      router.replace("/login");
    }
  }, [meLoading, meFetching, meError, user, router]);

  if (meLoading || meFetching || !user) {
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
      <div className="flex items-center gap-4 bg-surface border border-edge rounded-lg shadow-sm p-4">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-brand"
          />
        ) : (
          <div className="h-16 w-16 shrink-0 rounded-full bg-brand text-brand-contrast flex items-center justify-center text-xl font-bold">
            {initials}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-ink">{user.name || user.email}</h1>
          <p className="text-sm text-ink-muted">Member since {joinDate}</p>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="ml-auto text-sm text-danger hover:text-danger-hover transition-colors"
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
      <div className="flex border border-edge rounded-full mt-8 w-fit">
        <button
          type="button"
          className={`px-4 py-1 text-sm rounded-full transition-colors ${
            tab === "watchlist" ? "bg-brand text-brand-contrast" : "text-ink-muted hover:text-ink"
          }`}
          onClick={() => setTab("watchlist")}
        >
          Watchlist
        </button>
        <button
          type="button"
          className={`px-4 py-1 text-sm rounded-full transition-colors ${
            tab === "watched" ? "bg-brand text-brand-contrast" : "text-ink-muted hover:text-ink"
          }`}
          onClick={() => setTab("watched")}
        >
          Watched
        </button>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center text-center">
          <p className="text-ink-muted">
            {tab === "watchlist"
              ? "Your watchlist is empty."
              : "You haven't marked anything as watched yet."}
          </p>
          <Link
            href="/"
            className="mt-4 bg-brand text-brand-contrast px-4 py-2 rounded-3xl text-sm font-medium hover:bg-brand-hover transition-colors"
          >
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
