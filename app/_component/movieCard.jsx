import React from 'react';
import Image from 'next/image';
import banner from "@/app/public/banner.png"
import Link from 'next/link';

const MovieCard = ({ movie }) => {
    const {id, title, image, overview, runtime, release_date, genres} = movie

  return (

    <Link href={`/details/${id}`}>
    
    <div className="group relative w-full sm:w-[180px] border-2 p-2 rounded-md">
      <div className="flex justify-center h-[120px] sm:h-[100px] w-full overflow-hidden rounded-md group-hover:opacity-10 lg:h-32 xl:h-40">
        <div className="relative w-full h-full">
          <Image
            alt={movie.title}
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path
              || banner}`}
            layout="fill"
            objectFit="cover"
            className="object-cover"
          />
        </div>
      </div>
      <h3 className="mt-4 font-bold text-sm sm:text-sm ">
        {title.length > 20? `${title.slice(0, 16)}...` : movie.title}
      </h3>
      <div className="mt-8 flex justify-between items-center">
        <p className="mt-1 text-xs sm:text-sm font-medium ">
          {movie.release_date}
        </p>
        <p className="mt-1 text-xs sm:text-sm font-medium text-yellow-500">
          Rating: {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>


    </Link>



 
  );
};

export default MovieCard;
