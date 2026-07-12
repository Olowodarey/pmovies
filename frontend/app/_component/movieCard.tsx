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
      <div className="group relative w-full sm:w-[280px] bg-surface border border-edge p-2 rounded-lg shadow-sm hover:shadow-lg hover:border-brand transition-all">
        <div className="flex justify-center h-[250px] sm:h-[100px] w-full overflow-hidden rounded-md lg:h-[250px] xl:h-[300px]">
          <div className="relative w-full h-full">
            <Image
              alt={title}
              src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : banner}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
        <h3 className="mt-4 font-bold text-sm sm:text-sm text-ink">
          {title.length > 30 ? `${title.slice(0, 20)}...` : title}
        </h3>
        <div className="mt-2 flex justify-between items-center">
          <p className="mt-1 text-xs sm:text-sm font-medium text-ink-muted">{release_date}</p>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-brand">
            ★ {vote_average.toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
