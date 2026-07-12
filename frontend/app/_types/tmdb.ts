export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  revenue: number;
  budget: number;
}

export interface Series {
  id: number;
  name: string;
  title?: string;
  overview: string;
  poster_path: string | null;
  first_air_date: string;
  release_date?: string;
  vote_average: number;
}

export interface Video {
  id: string;
  key: string;
  site: string;
  type: string;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
