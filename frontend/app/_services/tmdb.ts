import type { Movie, MovieDetails, PaginatedResponse, Series, Video } from "@/app/_types/tmdb";

const BASE = "https://api.themoviedb.org/3";

async function get<T>(path: string, revalidate: number): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_TOKEN}` },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status} — ${path}`);
  return res.json() as Promise<T>;
}

export const tmdb = {
  trending: (timeWindow: "day" | "week", page: number) =>
    get<PaginatedResponse<Movie>>(
      `/trending/movie/${timeWindow}?page=${page}`,
      3600, // 1 h
    ),

  upcoming: (page: number) =>
    get<PaginatedResponse<Movie>>(`/movie/upcoming?page=${page}`, 86400),

  topRated: (page: number) =>
    get<PaginatedResponse<Movie>>(`/movie/top_rated?page=${page}`, 86400),

  animated: (page: number) =>
    get<PaginatedResponse<Movie>>(
      `/discover/movie?with_genres=16&page=${page}`,
      21600, // 6 h
    ),

  series: (page: number) =>
    get<PaginatedResponse<Series>>(`/tv/top_rated?page=${page}`, 21600),

  byGenre: (genreId: number, decade: number | undefined, page: number) => {
    const p = new URLSearchParams({ with_genres: String(genreId), page: String(page) });
    if (decade) {
      p.set("primary_release_date.gte", `${decade}-01-01`);
      p.set("primary_release_date.lte", `${decade + 9}-12-31`);
    }
    return get<PaginatedResponse<Movie>>(`/discover/movie?${p}`, 21600);
  },

  movieById: (id: string) =>
    get<MovieDetails>(`/movie/${id}`, 86400),

  movieVideos: (id: string) =>
    get<{ results: Video[] }>(`/movie/${id}/videos`, 604800), // 1 week

  similarMovies: (id: string) =>
    get<PaginatedResponse<Movie>>(`/movie/${id}/similar`, 21600),

  search: (query: string) =>
    get<PaginatedResponse<Movie>>(
      `/search/movie?query=${encodeURIComponent(query)}`,
      0, // never cache search
    ),
};
