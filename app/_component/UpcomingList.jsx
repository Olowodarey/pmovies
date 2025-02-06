import React from "react";
import { useFetchUpComingQuery } from "@/app/_services/fetchquerry";
import MovieCard from "@/app/_component/movieCard";
import Loading from "../Loading";

const UpcomingList = () => {
  const { data, error, isLoading } = useFetchUpComingQuery();

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loading /></div>;
  if (error) return <div>Error: {error.message}</div>;

  const moviesToDisplay = data?.results.slice(0, 12) || [];

  return (
    <div className=" mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
      {moviesToDisplay.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default UpcomingList;
