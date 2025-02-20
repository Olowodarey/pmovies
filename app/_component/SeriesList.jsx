import React from "react";
import { useFetchSeriesQuery } from "@/app/_services/fetchquerry";
import SeriesCard from "./SeriesCard"
import Loading from "../Loading";

const SeriesList = () => {
  const { data, error, isLoading } = useFetchSeriesQuery();

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loading /></div>;
  if (error) return <div>Error: {error.message}</div>;

  const seriesToDisplay = data?.results.slice(0, 12) || [];

  return (
    <div className="  mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
      {seriesToDisplay .map((series) => (
        <SeriesCard   key={series.id} series={series} />
      ))}
    </div>
  );
};

export default SeriesList;
