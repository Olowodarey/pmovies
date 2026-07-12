"use client";
import React from "react";
import { useFetchSeriesQuery } from "@/app/_services/fetchquerry";
import SeriesCard from "@/app/_component/SeriesCard";
import Loading from "../Loading";

const page = () => {
  const { data, error, isLoading } = useFetchSeriesQuery();

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loading/></div>;
  if (error) return <div>Error: {error.message}</div>;

  const seriesToDisplay = data?.results;

  return (
    <div>
      <div className="flex justify-center lg:block mt-7 ">
        <p className="text-xl font-bold px-4"> check out Top rated  series</p>
      </div>
      <div className=" px-4  mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
        {seriesToDisplay.map((series) => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
    </div>
  );
};

export default page;
