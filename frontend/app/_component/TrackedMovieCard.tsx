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
    <div className="group relative w-full sm:w-[280px] border-2 border-gray-800 p-2 rounded-md">
      <div className="flex justify-center h-[250px] sm:h-[100px] w-full overflow-hidden rounded-md lg:h-[250px] xl:h-[300px]">
        <div className="relative w-full h-full">
          <Image
            alt={item.title}
            src={
              item.posterPath
                ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
                : banner
            }
            fill
            className="object-cover"
          />
        </div>
      </div>

      <h3 className="mt-4 font-bold text-sm">
        {item.title.length > 30 ? `${item.title.slice(0, 20)}...` : item.title}
      </h3>
      <p className="mt-1 text-xs text-gray-400">
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
                <FaStar className="h-4 w-4 text-yellow-500" />
              ) : (
                <FaRegStar className="h-4 w-4 text-yellow-500" />
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
            className="bg-blue-600 px-2 py-1 rounded-3xl text-xs"
          >
            Mark Watched
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red-500 ml-auto"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default TrackedMovieCard;
