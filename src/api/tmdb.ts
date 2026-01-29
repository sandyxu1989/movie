import {
  CastMember,
  MovieDetail,
  MovieSummary,
  Review,
  Video,
} from '../types/movie'
import { getCache, setCache } from '../utils/cache'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '071a654c4f849ddc23f78d789c041407'
const READ_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNzFhNjU0YzRmODQ5ZGRjMjNmNzhkNzg5YzA0MTQwNyIsIm5iZiI6MTc2OTY5OTAxOC41NzIsInN1YiI6IjY5N2I3NmNhOTU4YzhkOTVhMTdmNzcxMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D2eaeiM4h2PrBm4PXtJstubVZ8ISI5_UPJoSITxh34c'

type SearchResult = {
  page: number
  total_pages: number
  results: MovieSummary[]
}

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const num = Number(value)
    return isNaN(num) ? fallback : num
  }
  return fallback
}

const buildImageUrl = (path: unknown): string | null => {
  const p = asString(path)
  return p ? `${IMAGE_BASE_URL}${p}` : null
}

const normalizeMovieSummary = (raw: any): MovieSummary => {
  return {
    id: asNumber(raw?.id),
    title: asString(raw?.title || raw?.name, '未知片名'),
    overview: asString(raw?.overview),
    rating: asNumber(raw?.vote_average),
    releaseDate: asString(raw?.release_date || raw?.first_air_date),
    posterUrl: buildImageUrl(raw?.poster_path),
  }
}

const normalizeCast = (raw: any): CastMember => {
  return {
    id: asNumber(raw?.id),
    name: asString(raw?.name, '未知演员'),
    character: asString(raw?.character),
    profileUrl: buildImageUrl(raw?.profile_path),
  }
}

const normalizeVideo = (raw: any): Video => {
  return {
    id: asString(raw?.id),
    key: asString(raw?.key),
    site: asString(raw?.site),
    name: asString(raw?.name),
    type: asString(raw?.type),
  }
}

const normalizeReview = (raw: any): Review => {
  return {
    id: asString(raw?.id),
    author: asString(raw?.author),
    content: asString(raw?.content),
    url: asString(raw?.url),
  }
}

const fetchJson = async <T>(
  path: string,
  params: Record<string, string | number | boolean> = {},
  cacheKey?: string,
): Promise<T> => {
  const url = new URL(`${API_BASE_URL}/${path}`)
  url.searchParams.set('api_key', API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })

  try {
    const response = await fetch(url.toString(), {
      headers: READ_TOKEN ? { Authorization: `Bearer ${READ_TOKEN}` } : undefined,
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data?.status_message || '无法获取数据')
    }

    const data = await response.json()
    if (cacheKey) {
      setCache(cacheKey, data)
    }
    return data as T
  } catch (error) {
    if (cacheKey) {
      const cached = getCache<T>(cacheKey)
      if (cached) {
        return cached
      }
    }
    throw error
  }
}

export const searchMovies = async (
  query: string,
  page: number,
): Promise<SearchResult> => {
  const cacheKey = `search:${query}:${page}`
  const data = await fetchJson<any>(
    'search/movie',
    {
      query,
      page,
      include_adult: false,
      language: 'zh-CN',
    },
    cacheKey,
  )

  return {
    page: asNumber(data?.page, page),
    total_pages: asNumber(data?.total_pages, page),
    results: (data?.results || []).map(normalizeMovieSummary),
  }
}

export const getTrendingMovies = async (
  page: number,
): Promise<SearchResult> => {
  const cacheKey = `trending:${page}`
  const data = await fetchJson<any>(
    'trending/movie/week',
    {
      page,
      language: 'zh-CN',
    },
    cacheKey,
  )

  return {
    page: asNumber(data?.page, page),
    total_pages: asNumber(data?.total_pages, page),
    results: (data?.results || []).map(normalizeMovieSummary),
  }
}

export const getMovieDetail = async (movieId: number) => {
  const cacheKey = `movie:${movieId}`
  const data = await fetchJson<any>(
    `movie/${movieId}`,
    {
      language: 'zh-CN',
      append_to_response: 'credits,videos,reviews',
    },
    cacheKey,
  )

  const directors = (data?.credits?.crew || [])
    .filter((member: any) => member?.job === 'Director')
    .map((member: any) => asString(member?.name, '未知导演'))

  const detail: MovieDetail = {
    ...normalizeMovieSummary(data),
    runtime: asNumber(data?.runtime) || null,
    genres: (data?.genres || []).map((g: any) => asString(g?.name)),
    directors,
    cast: (data?.credits?.cast || []).map(normalizeCast),
    videos: (data?.videos?.results || []).map(normalizeVideo),
    reviews: (data?.reviews?.results || []).map(normalizeReview),
  }

  return detail
}

export const getTrailer = (videos: Video[]) =>
  videos.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer',
  ) || null
