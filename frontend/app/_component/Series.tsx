"use client";
import React, { useState } from "react";
import SeriesList from "@/app/_component/SeriesList";
import Link from "next/link";


const Series = () => {
  

  return (
    <div className="mt-10 mb-10">
    <div className=" lg:flex justify-center px- space-x-1 items-center">
        <div className="line" >
          <div className="flex justify-center text-xl font-bold lg:text-2xl">
             Series
          </div>
        </div>
      </div>



      <div className="mt-5">
        <SeriesList />
      </div>

        <Link href={'/series'}>

        <div className="mt-5 flex justify-center">
        <button className="bg-blue-600 px-2 rounded-3xl">See More</button>
      </div>

        </Link>
    </div>
  );
};

export default Series;
