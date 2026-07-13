import { tmdb } from "@/app/_services/tmdb";
import SeriesCard from "./SeriesCard";

const SeriesList = async () => {
  const data = await tmdb.series(1);
  const series = data.results.slice(0, 12);

  return (
    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
      {series.map((s) => (
        <SeriesCard key={s.id} series={s} />
      ))}
    </div>
  );
};

export default SeriesList;
