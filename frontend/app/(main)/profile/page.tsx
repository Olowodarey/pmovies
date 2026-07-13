"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  useGetMeQuery,
  useGetWatchlistQuery,
  useGetWatchedQuery,
  useGetUserStatsQuery,
  useLogoutMutation,
  useRemoveFromWatchlistMutation,
  useMarkAsWatchedMutation,
  useRemoveWatchedMutation,
  useUpdateWatchedRatingMutation,
} from "@/app/_services/backendApi";

import TrackedMovieCard from "@/app/_component/TrackedMovieCard";
import Loading from "@/app/Loading";
import {
  FilmIcon,
  TvIcon,
  EyeIcon,
  CalendarDaysIcon,
  ClockIcon,
  StarIcon,
  BookmarkIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

type Tab = "watchlist" | "watched";

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string | number;
}) => (
  <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-edge bg-surface p-4 shadow-sm text-center">
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10">
      <Icon className="h-5 w-5 text-brand" strokeWidth={1.8} />
    </span>
    <p className="text-xl font-bold text-ink">{value}</p>
    <p className="text-xs text-ink-muted">{label}</p>
  </div>
);

const ProfilePage = () => {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("watchlist");

  // Force a fresh fetch every mount — never trust a cached error from a prior
  // unauthenticated visit. This is the key fix for cross-domain auth flow:
  // backend cookie is on Railway domain, so /auth/me is the only way for the
  // frontend to know if we're actually logged in.
  const {
    data: user,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: watchlist = [] } = useGetWatchlistQuery(undefined, { skip: !user });
  const { data: watched = [] } = useGetWatchedQuery(undefined, { skip: !user });
  const { data: stats } = useGetUserStatsQuery(undefined, { skip: !user });

  const [logout] = useLogoutMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();
  const [markAsWatched] = useMarkAsWatchedMutation();
  const [removeWatched] = useRemoveWatchedMutation();
  const [updateRating] = useUpdateWatchedRatingMutation();

  // Only redirect after the fetch has definitively settled AND failed.
  useEffect(() => {
    if (!isLoading && !isFetching && isError && !user) {
      router.replace("/login");
    }
  }, [isLoading, isFetching, isError, user, router]);

  // Show loading while:
  //  - the initial fetch is still going, OR
  //  - the query hasn't fetched yet (isUninitialized / no data / no error)
  // Only render the profile once we have a confirmed user object.
  if (!isSuccess || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  const initials = (user.name || user.email).slice(0, 2).toUpperCase();
  const joinDate = new Date(user.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const items = tab === "watchlist" ? watchlist : watched;

  return (
    <div className="px-5 lg:px-7 mt-7 pb-16">
      {/* Profile header */}
      <div className="flex items-center gap-4 bg-surface border border-edge rounded-2xl shadow-sm p-5">
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

      {/* Stats grid */}
      {stats && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-muted mb-3">
            Your Activity
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={EyeIcon} label="Total Watched" value={stats.totalWatched} />
            <StatCard icon={BookmarkIcon} label="Watchlist" value={stats.totalWatchlist} />
            <StatCard icon={CalendarDaysIcon} label="This Month" value={stats.thisMonth} />
            <StatCard icon={ClockIcon} label="This Year" value={stats.thisYear} />
            <StatCard icon={FilmIcon} label="Movies" value={stats.moviesCount} />
            <StatCard icon={TvIcon} label="TV Shows" value={stats.tvCount} />
            <StatCard
              icon={StarIcon}
              label="Avg Rating"
              value={stats.avgRating !== null ? `${stats.avgRating} / 5` : "—"}
            />
            <div className="col-span-1 flex flex-col items-center justify-center gap-2 rounded-2xl border border-edge bg-surface p-4 shadow-sm text-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10">
                <TagIcon className="h-5 w-5 text-brand" strokeWidth={1.8} />
              </span>
              {stats.topGenres.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-1 mt-0.5">
                  {stats.topGenres.slice(0, 3).map((g) => (
                    <span
                      key={g.id}
                      className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xl font-bold text-ink">—</p>
              )}
              <p className="text-xs text-ink-muted">Top Genres</p>
            </div>
          </div>
        </div>
      )}

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
