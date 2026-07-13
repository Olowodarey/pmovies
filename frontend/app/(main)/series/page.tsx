import { tmdb } from "@/app/_services/tmdb";
import SeriesCard from "@/app/_component/SeriesCard";
import PaginationControls from "@/app/_component/PaginationControls";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function SeriesPage({ searchParams }: Props) {
  const { page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const data = await tmdb.series(page);

  return (
    <div className="px-5 lg:px-7 mt-7 pb-16">
      <div className="flex flex-col items-center text-center gap-1">
        <span className="text-4xl">📺</span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Top Rated Series</h1>
        <p className="text-sm text-ink-muted">The highest-rated TV shows ever made</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
        {data.results.map((series) => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>

      <PaginationControls
        page={page}
        totalPages={data.total_pages}
        buildHref={(p) => `/series?page=${p}`}
      />
    </div>
  );
}
