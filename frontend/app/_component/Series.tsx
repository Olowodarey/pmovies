import SeriesList from "@/app/_component/SeriesList";
import Link from "next/link";

const Series = () => {
  return (
    <div className="mt-10 mb-10">
      <div className=" lg:flex justify-center px- space-x-1 items-center">
        <div className="line">
          <div className="flex justify-center font-display text-xl font-bold tracking-tight lg:text-2xl text-ink">
            Series
          </div>
        </div>
      </div>

      <div className="mt-5">
        <SeriesList />
      </div>

      <Link href={"/series"}>
        <div className="mt-5 flex justify-center">
          <button className="bg-brand text-brand-contrast px-4 py-1.5 rounded-3xl text-sm font-medium hover:bg-brand-hover transition-colors">
            See More
          </button>
        </div>
      </Link>
    </div>
  );
};

export default Series;
