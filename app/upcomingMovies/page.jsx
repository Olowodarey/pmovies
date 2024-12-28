"use client";

import React from "react";
import { useFetchUpComingQuery } from "@/app/_services/fetchquerry";
import MovieCard from "@/app/_component/movieCard";
import Loading from "../Loading";

const page = () => {
  const { data, error, isLoading } = useFetchUpComingQuery();

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loading /></div>;
  if (error) return <div>Error: {error.message}</div>;

  const moviesToDisplay = data?.results;

  return (
    <div>
      <div className="flex mt-5 justify-center">
        <p className="text-xl font-bold"> check out Upcoming movies</p>
      </div>

      <div className=" px-4 mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-5 lg:gap-x-2">
        {moviesToDisplay.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default page;
