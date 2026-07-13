import Link from "next/link";
import { tmdb } from "@/app/_services/tmdb";
import MovieCard from "@/app/_component/movieCard";
import PaginationControls from "@/app/_component/PaginationControls";

type Props = {
  searchParams: Promise<{ window?: string; page?: string }>;
};

export default async function TrendingPage({ searchParams }: Props) {
  const { window: tw = "day", page: pageStr = "1" } = await searchParams;
  const timeWindow = tw === "week" ? "week" : "day";
  const page = Math.max(1, Number(pageStr) || 1);

  const data = await tmdb.trending(timeWindow, page);

  const buildHref = (p: number) =>
    `/Trending?window=${timeWindow}&page=${p}`;

  return (
    <div className="px-5 lg:px-7 mt-7 pb-16">
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-4xl">🔥</span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Trending Movies</h1>
        <p className="text-sm text-ink-muted">What everyone&apos;s watching right now</p>

        {/* URL-driven toggle — pure Links, zero JS */}
        <div className="flex border border-edge rounded-full w-fit">
          <Link
            href={`/Trending?window=day&page=1`}
            className={`px-4 py-1 text-sm rounded-full transition-colors ${
              timeWindow === "day"
                ? "bg-brand text-brand-contrast"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Today
          </Link>
          <Link
            href={`/Trending?window=week&page=1`}
            className={`px-4 py-1 text-sm rounded-full transition-colors ${
              timeWindow === "week"
                ? "bg-brand text-brand-contrast"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            This Week
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
        {data.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <PaginationControls
        page={page}
        totalPages={data.total_pages}
        buildHref={buildHref}
      />
    </div>
  );
}
