export interface Movie {
  adult: boolean
  backdrop_path: string
  id: number
  media_type: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
};

export interface MovieDetails extends Movie {
  belongs_to_collection: string | null
  budget: number
  genres: Genre[]
  homepage: string
  imdb_id: string
  production_companies : Company[]
  production_contries: Country[]
  revenue: number
  runtime: number
  spoken_languages: Language[]
  status: string
  tagline: string
}

export interface Genre {
  id: number
  name: string
}

export interface Company {
  id: number
  logo_path: string
  name: string
  original_country: string
}

export interface Country {
  iso_3166_1: string
  name: string
}

export interface Language {
  english_name: string
  iso_639_1: string
  name: string
}