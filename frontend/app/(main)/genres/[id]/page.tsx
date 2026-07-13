import Link from "next/link";
import { tmdb } from "@/app/_services/tmdb";
import MovieCard from "@/app/_component/movieCard";
import PaginationControls from "@/app/_component/PaginationControls";

const DECADES = [
  { label: "All time", value: "" },
  { label: "2020s", value: "2020" },
  { label: "2010s", value: "2010" },
  { label: "2000s", value: "2000" },
  { label: "1990s", value: "1990" },
  { label: "1980s", value: "1980" },
  { label: "1970s", value: "1970" },
];

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; decade?: string; page?: string }>;
};

export default async function GenreMoviesPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { name = "Genre", decade: decadeStr = "", page: pageStr = "1" } = await searchParams;

  const decade = decadeStr ? Number(decadeStr) : undefined;
  const page = Math.max(1, Number(pageStr) || 1);

  const data = await tmdb.byGenre(Number(id), decade, page);

  const buildHref = (p: number) => {
    const base = `/genres/${id}?name=${encodeURIComponent(name)}`;
    return `${base}${decadeStr ? `&decade=${decadeStr}` : ""}&page=${p}`;
  };

  return (
    <div className="px-5 lg:px-7 mt-7 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">{name} Movies</h1>

        {/* Decade filter — pure Links */}
        <div className="flex flex-wrap gap-2">
          {DECADES.map((d) => (
            <Link
              key={d.label}
              href={`/genres/${id}?name=${encodeURIComponent(name)}${d.value ? `&decade=${d.value}` : ""}&page=1`}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                (decadeStr ?? "") === d.value
                  ? "bg-brand text-brand-contrast border-brand"
                  : "border-edge text-ink-muted hover:text-ink"
              }`}
            >
              {d.label}
            </Link>
          ))}
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
