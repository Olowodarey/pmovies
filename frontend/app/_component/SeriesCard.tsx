import Image from "next/image";
import banner from "@/app/public/banner.png";
import type { Series } from "@/app/_types/tmdb";

interface SeriesCardProps {
  series: Series;
}

const SeriesCard = ({ series }: SeriesCardProps) => {
  const title = series.title || series.name;
  const releaseDate = series.release_date || series.first_air_date;
  const posterPath = series.poster_path
    ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
    : banner;

  return (
    <div className="group relative w-full bg-surface border border-edge p-2 rounded-lg shadow-sm hover:shadow-lg hover:border-brand transition-all">
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-md">
        <Image
          alt={title}
          src={posterPath}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-3 font-display font-semibold text-sm leading-snug min-h-[2.5rem] line-clamp-2 text-ink">
        {title}
      </h3>
      <div className="mt-2 flex justify-between items-center">
        <p className="text-xs sm:text-sm font-medium text-ink-muted">{releaseDate}</p>
        <p className="text-xs sm:text-sm font-semibold text-brand">
          ★ {series.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default SeriesCard;
