"use client";
import UpcomingList from "./UpcomingList";
import Link from "next/link";

const Upcoming = () => {
  return (
    <div className="mt-10">
      <div className="hidden lg:flex justify-center px- space-x-1 items-center">
        <div className="line">
          <div className="text-xs font-bold lg:text-2xl text-ink">check out Upcoming Movies</div>
        </div>
      </div>

      <div className="lg:hidden flex justify-center px- space-x-1 items-center">
        <div className="line ">
          <div className="text-s font-bold lg:text-2xl text-ink">UpcomingMovies</div>
        </div>
      </div>

      <div className="mt-5">
        <UpcomingList />
      </div>

      <Link href={"/upcomingMovies"}>
        <div className="mt-5 flex justify-center">
          <button className="bg-brand text-brand-contrast px-4 py-1.5 rounded-3xl text-sm font-medium hover:bg-brand-hover transition-colors">
            See More
          </button>
        </div>
      </Link>
    </div>
  );
};

export default Upcoming;
