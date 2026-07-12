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
    <div className="group relative w-full bg-surface border border-edge p-2 rounded-lg shadow-sm hover:shadow-lg transition-all">
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-md">
        <Image
          alt={item.title}
          src={
            item.posterPath
              ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
              : banner
          }
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <h3 className="mt-3 font-display font-semibold text-sm leading-snug min-h-[2.5rem] line-clamp-2 text-ink">
        {item.title}
      </h3>
      <p className="mt-1 text-xs text-ink-muted">
        {variant === "watched" ? "Watched" : "Added"} {new Date(date).toLocaleDateString()}
      </p>

      {variant === "watched" && (
        <div className="mt-2 flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRate?.(star)}
              aria-label={`Rate ${star} stars`}
            >
              {rating && star <= rating ? (
                <FaStar className="h-4 w-4 text-brand" />
              ) : (
                <FaRegStar className="h-4 w-4 text-brand" />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        {variant === "watchlist" && (
          <button
            type="button"
            onClick={onMarkWatched}
            className="bg-brand text-brand-contrast px-2 py-1 rounded-3xl text-xs font-medium hover:bg-brand-hover transition-colors"
          >
            Mark Watched
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-danger hover:text-danger-hover ml-auto transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default TrackedMovieCard;
