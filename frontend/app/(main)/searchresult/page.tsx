import { tmdb } from "@/app/_services/tmdb";
import MovieCard from "@/app/_component/movieCard";

type Props = {
  searchParams: Promise<{ query?: string }>;
};

export default async function SearchResultPage({ searchParams }: Props) {
  const { query = "" } = await searchParams;

  if (!query.trim()) {
    return (
      <p className="mt-10 text-center text-ink-muted">
        Enter a movie name in the search bar above.
      </p>
    );
  }

  const data = await tmdb.search(query);

  if (!data.results.length) {
    return (
      <p className="mt-10 text-2xl font-bold flex justify-center text-ink-muted">
        No movie found for &quot;{query}&quot;
      </p>
    );
  }

  return (
    <div className="px-5 lg:px-7 mt-7 pb-16">
      <h1 className="text-xl font-bold text-ink">
        Results for &quot;{query}&quot;
        <span className="ml-2 text-sm font-normal text-ink-muted">
          ({data.total_results} found)
        </span>
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-2">
        {data.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
