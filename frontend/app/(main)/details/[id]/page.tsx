import { tmdb } from "@/app/_services/tmdb";
import Moviedetails from "@/app/_component/moviedetails";
import MovieCard from "@/app/_component/movieCard";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: Props) {
  const { id } = await params;

  // All three fetched in parallel — each independently cached on the server
  const [movie, videoData, similarData] = await Promise.all([
    tmdb.movieById(id),
    tmdb.movieVideos(id),
    tmdb.similarMovies(id),
  ]);

  const trailer = videoData.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube",
  )?.key;

  return (
    <div>
      {/* Moviedetails stays "use client" — it uses RTK Query for watchlist/watched buttons */}
      <Moviedetails movie={movie} trailer={trailer} />

      <div className="mt-10 pb-16">
        <h2 className="flex justify-center text-2xl font-bold text-ink">Similar Movies</h2>
        <div className="mt-5 px-4 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {similarData.results.slice(0, 8).map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
