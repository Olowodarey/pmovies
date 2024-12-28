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
      <div className="flex mt-5 justify-center">
        <p className="text-xl font-bold"> check out Top rated  series</p>
      </div>
      <div className=" px-4  mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-5 lg:gap-x-2">
        {seriesToDisplay.map((series) => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
    </div>
  );
};

export default page;
