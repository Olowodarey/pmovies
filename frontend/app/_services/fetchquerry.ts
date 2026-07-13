// Client-side TMDB queries — only used by interactive client components
// (people search, home-page trending preview with day/week toggle).
// All full-page TMDB fetching uses the server-side tmdb helper instead.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Movie, PaginatedResponse, Person, Series } from "@/app/_types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3/";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${ACCESS_TOKEN}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Home-page trending preview (needs day/week client toggle)
    fetchTrendingMovies: builder.query<
      PaginatedResponse<Movie>,
      { timeWindow?: "day" | "week"; page?: number }
    >({
      query: ({ timeWindow = "day", page = 1 } = {}) =>
        `trending/movie/${timeWindow}?page=${page}`,
    }),
    // Home-page upcoming preview
    fetchUpComing: builder.query<PaginatedResponse<Movie>, number | void>({
      query: (page = 1) => `movie/upcoming?page=${page}`,
    }),
    // Home-page series preview
    fetchSeries: builder.query<PaginatedResponse<Series>, number | void>({
      query: (page = 1) => `tv/top_rated?page=${page}`,
    }),
    // People search (interactive, client-driven)
    fetchSearchPerson: builder.query<PaginatedResponse<Person>, string>({
      query: (name) => `search/person?query=${encodeURIComponent(name)}`,
    }),
    fetchPersonMovies: builder.query<PaginatedResponse<Movie>, number>({
      query: (personId) =>
        `discover/movie?with_cast=${personId}&sort_by=popularity.desc`,
    }),
  }),
});

export const {
  useFetchTrendingMoviesQuery,
  useFetchUpComingQuery,
  useFetchSeriesQuery,
  useFetchSearchPersonQuery,
  useFetchPersonMoviesQuery,
} = tmdbApi;
