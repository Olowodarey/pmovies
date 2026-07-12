import React from 'react';
import Image from 'next/image';
import banner from "@/app/public/banner.png";

const SeriesCard = ({ series }) => {
  const title = series.title || series.name; 
  const releaseDate = series.release_date || series.first_air_date;
  const posterPath = series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : banner;

  return (
    <div className="group relative w-full sm:w-[180px] border-2 p-2 rounded-md">
      <div className="flex justify-center h-[120px] sm:h-[100px] w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-32 xl:h-40">
        <div className="relative w-full h-full">
          <Image
            alt={title}
            src={posterPath}
            layout="fill"
            objectFit="cover"
            className="object-cover"
          />
        </div>
      </div>
      <h3 className="mt-4 text-sm sm:text-lg">
        {title.length > 20? `${title.slice(0, 16)}...` : title}
      </h3>
      <div className="mt-6 flex justify-between">
        <p className="mt-1 text-xs sm:text-sm font-medium">
          {releaseDate}
        </p>
        <p className="mt-1 text-xs sm:text-sm font-medium text-yellow-500">
          Rating: {series.vote_average.toFixed(1)} 
        </p>
      </div>
    </div>
  );
};

export default SeriesCard;
