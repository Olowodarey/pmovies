"use client";
import React from "react";
import banner from "@/app/public/banner.png";
import Image from "next/image";
import { FaRegCalendarTimes } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoTime } from "react-icons/io5";
import Link from "next/link";


const formatCurrency = (amount) => {
  return amount ? `$${amount.toLocaleString()}` : "N/A";
};

const Moviedetails = ({ movie, trailer }) => {
  const { title, overview, runtime, release_date, genres, poster_path, revenue, budget, } = movie;

  
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  const formattedRuntime = `${hours}h ${minutes}m`;

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-1">
          {/* Image gallery */}
          <div className="relative h-[500px] w-full sm:w-[400px] overflow-hidden rounded-lg bg-gray-500 flex items-center justify-center">
            <Image
              src={`https://image.tmdb.org/t/p/w500${poster_path || banner}`}
              alt={title}
              layout="fill"
              className="object-cover"
            />
          </div>

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <div className="grid items-center space-y-2 lg:space-y-0 px-1 lg:flex mt-2 lg:space-x-2">
              <p className="flex space-x-1 text-sm font-medium">
                <FaRegCalendarTimes />
                <span>{release_date}</span>
              </p>
              <p className="flex space-x-1 text-sm font-medium">
                <GoDotFill />
                <span>{genres.map((genre) => genre.name).join(", ")}</span>
              </p>
              <p className="flex space-x-1 text-sm font-medium">
                <IoTime />
                <span>{formattedRuntime}</span>
              </p>
            </div>
            <p className="mt-4 text-lg">{overview}</p>
            <div className="flex space-x-4 mt-4">
              <p>Budget: {formatCurrency(budget)}</p>
              <p>Revenue: {formatCurrency(revenue)}</p>
            </div>
            {trailer && (
              <button className="mt-6 ">
                <Link
                  href={trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-500 hover:underline"
                >
                  Watch Trailer
                </Link>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Moviedetails;
