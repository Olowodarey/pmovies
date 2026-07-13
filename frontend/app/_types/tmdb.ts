export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string;
  vote_average: number;
  vote_count?: number;
  genre_ids?: number[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  revenue: number;
  budget: number;
  tagline: string | null;
  status: string;
  original_language: string;
  original_title: string;
  popularity: number;
  imdb_id: string | null;
  homepage: string | null;
  spoken_languages: SpokenLanguage[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  vote_count: number;
}

export interface Series {
  id: number;
  name: string;
  title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  first_air_date: string;
  release_date?: string;
  vote_average: number;
  vote_count?: number;
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

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity?: number;
  known_for: Movie[];
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  imdb_id: string | null;
  known_for_department: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
  also_known_as: string[];
}

export interface MovieCredit {
  id: number;
  title: string;
  character: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  popularity: number;
  overview: string;
}
