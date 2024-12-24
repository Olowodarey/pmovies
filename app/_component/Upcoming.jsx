"use client";
import React, { useState } from "react";
import UpcomingList from "./UpcomingList";
import Link from "next/link";


const Upcoming = () => {
  return (
    <div className="mt-10">
      <div className="hidden lg:flex justify-center px- space-x-1 items-center">
        <div className="line" >
          <div className="text-xs font-bold lg:text-2xl">
             check out Upcoming Movies
          </div>
        </div>
      </div>

      <div className="lg:hidden flex justify-center px- space-x-1 items-center">
        <div className="lineM " >
          <div className="text-xs font-bold lg:text-2xl">
             check out Upcoming Movies
          </div>
        </div>
      </div>

      <div className="mt-5">
        <UpcomingList />
      </div>

        <Link href={'/upcomingMovies'}>
        <div className="mt-5 flex justify-center">
        <button className="bg-blue-600 px-2 rounded-3xl">See More</button>
      </div>
        </Link>

    
    </div>
  );
};

export default Upcoming;
