"use client";

import React from "react";
import { useFetchTrendingMoviesQuery } from "@/app/_services/fetchquerry";
import MovieCard from "@/app/_component/movieCard";
import Loading from "../Loading";

const page = ({ timeWindow }) => {
  const { data, error, isLoading } = useFetchTrendingMoviesQuery(timeWindow);

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loading /></div>;
  if (error) return <div>Error: {error.message}</div>;

  const moviesToDisplay = data.results;

  return (
    <div>

        <div className="flex justify-center lg:block mt-7 ">
           <p className="text-xl  font-bold px-6"> check out trending movies </p>
        </div>

      <div className=" px-6 mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
        {moviesToDisplay.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default page;
