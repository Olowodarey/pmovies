"use client";
import React from "react";
import banner from "@/app/public/banner.png";
import Image from "next/image";
import { FaRegCalendarTimes } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoTime } from "react-icons/io5";

const formatCurrency = (amount) => {
  return amount ? `$${amount.toLocaleString()}` : "N/A";
};

const Moviedetails = ({ movie, trailer }) => {  
  const {
    title,
    overview,
    runtime,
    release_date,
    genres,
    poster_path,
    revenue,
    budget,
  } = movie;

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  const formattedRuntime = `${hours}h ${minutes}m`;

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex flex-col     lg:grid lg:grid-cols-2  ">
          {/* Image gallery */}
          <div className="relative h-[400px] w-full sm:w-[400px] sm:h-[500px] overflow-hidden rounded-lg bg-gray-500 flex items-center justify-center">
            <Image
              src={`https://image.tmdb.org/t/p/w500${poster_path || banner}`}
              alt={title}
              layout="fill"
              className="object-cover"
            />
          </div>

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className=" text-xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            <div className="grid items-center space-y-1 lg:space-y-0 px-1 lg:flex mt-2 lg:space-x-4">
              <p className="flex  space-x-1 text-sm font-medium">
                <FaRegCalendarTimes />
                <span>{release_date}</span>
              </p>
              <p className="flex items-center space-x-1 text-sm font-medium">
              
                <span>Genre: {genres.map((genre) => genre.name).join(",")}</span>
              </p>
              <p className="flex items-center space-x-2 text-sm font-medium">
               
                <span>Duration: {formattedRuntime}</span>
              </p>
            </div>
            <p className="mt-4 text-sm">{overview}</p>
            <div className="flex text-sm space-x-4 mt-4">
              <p>Budget: {formatCurrency(budget)}</p>
              <p>Revenue: {formatCurrency(revenue)}</p>
            </div>

            
            {trailer && (
            <div className="flex justify-center mt-5">
            <iframe
              className="rounded-lg shadow-lg w-full sm:w-[600px] h-[200px] sm:h-[260px]"
              src={`https://www.youtube.com/embed/${trailer}?autoplay=1`}

              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

              
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Moviedetails;
