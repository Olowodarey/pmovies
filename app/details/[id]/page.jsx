"use client";
import React from 'react';
import Moviedetails from '../../_component/moviedetails';
import MovieCard from '../../_component/movieCard'; // Assuming you have a MovieCard component
import { useParams } from 'next/navigation';
import { useFetchMovieByIdQuery, useFetchMovieVideoQuery, useFetchSimilarMoviesQuery } from '@/app/_services/fetchquerry';
import Loading from '@/app/Loading';

const Moviepage = () => {
  const { id } = useParams();
  const { data: movie, error: movieError, isLoading: movieLoading } = useFetchMovieByIdQuery(id);
  const { data: videoData, error: videoError, isLoading: videoLoading } = useFetchMovieVideoQuery(id);
  const { data: similarMoviesData, error: similarMoviesError, isLoading: similarMoviesLoading } = useFetchSimilarMoviesQuery(id);

  if (movieLoading || videoLoading || similarMoviesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg"><Loading /></p>
      </div>
    );
  }

  if (movieError || videoError || similarMoviesError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-600">
          Error loading movie. Please try again later.
        </p>
      </div>
    );
  }

  const trailer = videoData?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube')?.key;
  const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer}` : null;

  return (
    <div>
      <Moviedetails movie={movie} trailer={trailerUrl} />

  
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Similar Movies</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {similarMoviesData?.results.slice(0, 8).map((similarMovie) => (
            <MovieCard key={similarMovie.id} movie={similarMovie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Moviepage;