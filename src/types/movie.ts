export type MovieSummary = {
  id: number
  title: string
  overview: string
  rating: number
  releaseDate: string
  posterUrl: string | null
}

export type CastMember = {
  id: number
  name: string
  character: string
  profileUrl: string | null
}

export type Review = {
  id: string
  author: string
  content: string
  url: string
}

export type Video = {
  id: string
  key: string
  site: string
  name: string
  type: string
}

export type MovieDetail = MovieSummary & {
  runtime: number | null
  genres: string[]
  directors: string[]
  cast: CastMember[]
  videos: Video[]
  reviews: Review[]
}

export type WatchlistItem = MovieSummary & {
  addedAt: string
}
