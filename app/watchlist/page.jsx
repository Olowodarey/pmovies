"use client";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatch, removeFromWatch } from '@/app/_lib/watchSlice';
import MovieCard from '@/app/_component/movieCard'; 

const Watchlist = () => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watch.Watchlists);

  const handleRemoveFromWatch = (id) => {
    dispatch(removeFromWatch({ id }));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h1 className="text-2xl font-bold">My Watchlist</h1>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-8">
        {watchlist.map((movie) => (
          <div key={movie.id}>
            <MovieCard movie={movie} />
            <button
              onClick={() => handleRemoveFromWatch(movie.id)}
              className="mt-2 text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
