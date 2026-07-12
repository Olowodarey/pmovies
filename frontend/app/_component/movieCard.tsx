import Image from "next/image";
import banner from "@/app/public/banner.png";
import Link from "next/link";
import type { Movie } from "@/app/_types/tmdb";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const { id, title, poster_path, release_date, vote_average } = movie;

  return (
    <Link href={`/details/${id}`}>
      <div className="group relative w-full bg-surface border border-edge p-2 rounded-lg shadow-sm hover:shadow-lg hover:border-brand transition-all">
        <div className="relative w-full aspect-[2/3] overflow-hidden rounded-md">
          <Image
            alt={title}
            src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : banner}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <h3 className="mt-3 font-display font-semibold text-sm leading-snug min-h-[2.5rem] line-clamp-2 text-ink">
          {title}
        </h3>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-xs sm:text-sm font-medium text-ink-muted">{release_date}</p>
          <p className="text-xs sm:text-sm font-semibold text-brand">
            ★ {vote_average.toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
