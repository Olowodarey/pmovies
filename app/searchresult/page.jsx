"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import MovieCard from "@/app/_component/movieCard"; 
import { useFetchSearchMoviesQuery } from "@/app/_services/fetchquerry"; 
import Loading from "../Loading";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const { data: movies, error, isLoading } = useFetchSearchMoviesQuery(query);

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loading /></div>;

  if (error) {
    return <p>no movie found </p>;
  }

  return (
    <div>
      <h1 className=" mt-10 text-2xl font-bold flex  justify-center ">Search Results for "{query}"</h1>
      <div className="movie-grid grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-8">
        {movies?.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchResults />
    </Suspense>
  );
}
