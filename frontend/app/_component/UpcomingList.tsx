import { tmdb } from "@/app/_services/tmdb";
import MovieCard from "@/app/_component/movieCard";

const UpcomingList = async () => {
  const data = await tmdb.upcoming(1);
  const movies = data.results.slice(0, 12);

  return (
    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default UpcomingList;
