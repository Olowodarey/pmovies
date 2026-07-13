"use client";

import Image from "next/image";
import banner from "@/app/public/banner.png";
import { FaRegStar, FaStar } from "react-icons/fa";
import type { WatchedItem, WatchlistItem } from "@/app/_types/backend";

interface TrackedMovieCardProps {
  item: WatchlistItem | WatchedItem;
  variant: "watchlist" | "watched";
  onRemove: () => void;
  onMarkWatched?: () => void;
  onRate?: (rating: number) => void;
}

const TrackedMovieCard = ({
  item,
  variant,
  onRemove,
  onMarkWatched,
  onRate,
}: TrackedMovieCardProps) => {
  const rating = variant === "watched" ? (item as WatchedItem).rating : null;
  const date =
    variant === "watched"
      ? (item as WatchedItem).watchedAt
      : (item as WatchlistItem).addedAt;

  return (
    <div className="group relative w-full bg-surface border-2 border-edge rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-brand transition-all duration-300">
      {/* Poster */}
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        <Image
          alt={item.title}
          src={
            item.posterPath
              ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
              : banner
          }
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Variant badge */}
        <div className="absolute top-2 left-2 rounded-full bg-black/70 backdrop-blur-sm px-2 py-0.5">
          <span className="text-white text-[10px] font-semibold uppercase tracking-wide">
            {variant === "watched" ? "✓ Watched" : "🔖 Saved"}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 text-center">
        <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 text-ink min-h-[2.5rem]">
          {item.title}
        </h3>
        <p className="mt-1 text-xs text-ink-muted">
          {variant === "watched" ? "Watched" : "Added"}{" "}
          {new Date(date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
        </p>

        {/* Star rating */}
        {variant === "watched" && (
          <div className="mt-2 flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onRate?.(star)}
                aria-label={`Rate ${star} stars`}
                className="transition-transform hover:scale-125"
              >
                {rating && star <= rating ? (
                  <FaStar className="h-3.5 w-3.5 text-brand" />
                ) : (
                  <FaRegStar className="h-3.5 w-3.5 text-brand" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {variant === "watchlist" && (
            <button
              type="button"
              onClick={onMarkWatched}
              className="bg-brand text-brand-contrast px-3 py-1 rounded-full text-xs font-semibold hover:bg-brand-hover transition-colors"
            >
              Mark Watched
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-danger hover:text-danger-hover transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackedMovieCard;
