// Client-side TMDB queries — only used by interactive client components
// (people page, home-page trending preview with day/week toggle).
// All full-page TMDB fetching uses the server-side tmdb helper instead.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Movie,
  MovieCredit,
  PaginatedResponse,
  Person,
  PersonDetails,
  Series,
} from "@/app/_types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3/";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

interface PersonMovieCredits {
  cast: MovieCredit[];
  crew: (MovieCredit & { job: string; department: string })[];
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
    // Popular people (people page default grid)
    fetchPopularPeople: builder.query<PaginatedResponse<Person>, number>({
      query: (page) => `person/popular?page=${page}`,
    }),
    // People search
    fetchSearchPerson: builder.query<PaginatedResponse<Person>, string>({
      query: (name) => `search/person?query=${encodeURIComponent(name)}&include_adult=false`,
    }),
    // Full person bio + stats
    fetchPersonDetails: builder.query<PersonDetails, number>({
      query: (id) => `person/${id}`,
    }),
    // All movie credits for a person (cast + crew)
    fetchPersonMovieCredits: builder.query<PersonMovieCredits, number>({
      query: (id) => `person/${id}/movie_credits`,
    }),
  }),
});

export const {
  useFetchTrendingMoviesQuery,
  useFetchUpComingQuery,
  useFetchSeriesQuery,
  useFetchPopularPeopleQuery,
  useFetchSearchPersonQuery,
  useFetchPersonDetailsQuery,
  useFetchPersonMovieCreditsQuery,
} = tmdbApi;
