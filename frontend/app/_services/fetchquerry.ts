import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Movie,
  MovieDetails,
  PaginatedResponse,
  Person,
  Series,
  Video,
} from "@/app/_types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3/";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

interface VideoResponse {
  results: Video[];
}

interface DiscoverParams {
  genreId?: number;
  decade?: number; // e.g. 1990 → 1990–1999
  page?: number;
}

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
    fetchTrendingMovies: builder.query<
      PaginatedResponse<Movie>,
      { timeWindow?: "day" | "week"; page?: number }
    >({
      query: ({ timeWindow = "day", page = 1 } = {}) =>
        `trending/movie/${timeWindow}?page=${page}`,
    }),
    fetchUpComing: builder.query<PaginatedResponse<Movie>, number | void>({
      query: (page = 1) => `movie/upcoming?page=${page}`,
    }),
    fetchSeries: builder.query<PaginatedResponse<Series>, number | void>({
      query: (page = 1) => `tv/top_rated?page=${page}`,
    }),
    fetchAnimatedMovies: builder.query<PaginatedResponse<Movie>, number | void>({
      query: (page = 1) => `discover/movie?with_genres=16&page=${page}`,
    }),
    fetchTopRatedMovies: builder.query<PaginatedResponse<Movie>, number | void>({
      query: (page = 1) => `movie/top_rated?page=${page}`,
    }),
    fetchMoviesByGenre: builder.query<PaginatedResponse<Movie>, DiscoverParams>({
      query: ({ genreId, decade, page = 1 }) => {
        const params = new URLSearchParams({ page: String(page) });
        if (genreId) params.set("with_genres", String(genreId));
        if (decade) {
          params.set("primary_release_date.gte", `${decade}-01-01`);
          params.set("primary_release_date.lte", `${decade + 9}-12-31`);
        }
        return `discover/movie?${params.toString()}`;
      },
    }),
    fetchMovieById: builder.query<MovieDetails, string | string[]>({
      query: (id) => `movie/${id}`,
    }),
    fetchMovieVideo: builder.query<VideoResponse, string | string[]>({
      query: (id) => `movie/${id}/videos`,
    }),
    fetchSimilarMovies: builder.query<PaginatedResponse<Movie>, string | string[]>({
      query: (id) => `movie/${id}/similar`,
    }),
    fetchSearchMovies: builder.query<PaginatedResponse<Movie>, string>({
      query: (title) => `search/movie?query=${encodeURIComponent(title)}`,
    }),
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
  useFetchAnimatedMoviesQuery,
  useFetchTopRatedMoviesQuery,
  useFetchMoviesByGenreQuery,
  useFetchMovieByIdQuery,
  useFetchMovieVideoQuery,
  useFetchSimilarMoviesQuery,
  useFetchSearchMoviesQuery,
  useFetchSearchPersonQuery,
  useFetchPersonMoviesQuery,
} = tmdbApi;
