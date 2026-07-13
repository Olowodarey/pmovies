import Image from "next/image";
import banner from "@/app/public/banner.png";
import type { Series } from "@/app/_types/tmdb";

interface SeriesCardProps {
  series: Series;
}

const SeriesCard = ({ series }: SeriesCardProps) => {
  const title = series.title || series.name;
  const releaseDate = series.release_date || series.first_air_date;
  const year = releaseDate?.slice(0, 4) ?? "";
  const posterSrc = series.poster_path
    ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
    : banner;

  return (
    <div className="group relative w-full bg-surface border-2 border-edge rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-brand hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      {/* Poster */}
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        <Image
          alt={title}
          src={posterSrc}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm px-2 py-0.5">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-white text-xs font-bold">
            {series.vote_average.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 text-center">
        <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 text-ink min-h-[2.5rem]">
          {title}
        </h3>
        <p className="mt-1 text-xs font-medium text-ink-muted">{year}</p>
      </div>
    </div>
  );
};

export default SeriesCard;
