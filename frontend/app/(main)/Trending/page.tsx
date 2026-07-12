"use client";

import { useFetchTrendingMoviesQuery } from "@/app/_services/fetchquerry";
import MovieCard from "@/app/_component/movieCard";
import Loading from "@/app/Loading";

const TrendingPage = () => {
  const { data, error, isLoading } = useFetchTrendingMoviesQuery();

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loading /></div>;
  if (error) return <div className="p-6 text-center text-danger">Error loading trending movies</div>;

  const moviesToDisplay = data?.results || [];

  return (
    <div>
      <div className="flex justify-center mt-7 px-6">
        <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          Trending Movies
        </p>
      </div>

      <div className=" px-6 mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
        {moviesToDisplay.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default TrendingPage;
