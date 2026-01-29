import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import ErrorNotice from '../../components/ErrorNotice'
import NetworkError from '../../components/NetworkError'
import EmptyState from '../../components/EmptyState'
import MovieCard from '../../components/MovieCard'
import { getTrendingMovies, searchMovies } from '../../api/tmdb'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import useWatchlist from '../../hooks/useWatchlist'
import { MovieSummary } from '../../types/movie'
import { checkNetworkError, getErrorMessage } from '../../utils/error'

type SortOption = 'relevance' | 'rating' | 'releaseDate'

const SearchPage = () => {
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState<MovieSummary[]>([])
  const [trending, setTrending] = useState<MovieSummary[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTrendingLoading, setIsTrendingLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isNetworkError, setIsNetworkError] = useState(false)
  const [isTrendingNetworkError, setIsTrendingNetworkError] = useState(false)
  const [trendingRetryKey, setTrendingRetryKey] = useState(0)
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const { addToWatchlist, isInWatchlist, removeFromWatchlist } =
    useWatchlist()

  useEffect(() => {
    if (!query) {
      setMovies([])
      setHasMore(false)
      return
    }

    let isActive = true

    const loadMovies = async () => {
      setIsLoading(true)
      setErrorMessage('')
      setIsNetworkError(false)
      try {
        const data = await searchMovies(query, page)
        if (!isActive) {
          return
        }
        setMovies((current) =>
          page === 1 ? data.results : [...current, ...data.results],
        )
        setHasMore(page < data.total_pages)
      } catch (error) {
        if (!isActive) {
          return
        }
        if (checkNetworkError(error)) {
          setIsNetworkError(true)
        } else {
          setErrorMessage(getErrorMessage(error, '无法获取搜索结果。'))
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadMovies()

    return () => {
      isActive = false
    }
  }, [page, query])

  useEffect(() => {
    if (query) {
      return
    }
    let isActive = true
    const loadTrending = async () => {
      setIsTrendingLoading(true)
      setErrorMessage('')
      setIsTrendingNetworkError(false)
      try {
        const data = await getTrendingMovies(1)
        if (isActive) {
          setTrending(data.results)
        }
      } catch (error) {
        if (isActive) {
          if (checkNetworkError(error)) {
            setIsTrendingNetworkError(true)
          } else {
            setErrorMessage(getErrorMessage(error, '无法获取热门电影。'))
          }
        }
      } finally {
        if (isActive) {
          setIsTrendingLoading(false)
        }
      }
    }

    loadTrending()

    return () => {
      isActive = false
    }
  }, [query, trendingRetryKey])

  const sortedMovies = useMemo(() => {
    if (sortBy === 'rating') {
      return [...movies].sort(
        (left, right) => right.rating - left.rating,
      )
    }
    if (sortBy === 'releaseDate') {
      return [...movies].sort((left, right) =>
        right.releaseDate.localeCompare(left.releaseDate),
      )
    }
    return movies
  }, [movies, sortBy])

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: () => setPage((current) => current + 1),
  })

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = queryInput.trim()
    if (!trimmed) {
      setErrorMessage('请输入关键词再搜索。')
      return
    }
    setPage(1)
    setQuery(trimmed)
  }

  const renderMovieCard = (movie: MovieSummary) => {
    const isSaved = isInWatchlist(movie.id)
    return (
      <Box key={movie.id}>
        <MovieCard
          movie={movie}
          action={
            <Button
              size="small"
              variant={isSaved ? 'outlined' : 'contained'}
              onClick={(event) => {
                event.preventDefault()
                if (isSaved) {
                  removeFromWatchlist(movie.id)
                } else {
                  addToWatchlist(movie)
                }
              }}
            >
              {isSaved ? '移除' : '加入清单'}
            </Button>
          }
        />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          搜索电影
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSearch}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="输入电影名称，例如：Inception"
            fullWidth
            label="关键词"
          />
          <Button
            variant="contained"
            size="large"
            type="submit"
            sx={{ minWidth: 120 }}
          >
            搜索
          </Button>
        </Stack>
      </Box>

      {query && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            select
            label="排序"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            sx={{ width: { xs: '100%', sm: 220 } }}
          >
            <MenuItem value="relevance">API 原始排序</MenuItem>
            <MenuItem value="rating">评分高到低</MenuItem>
            <MenuItem value="releaseDate">上映日期新到旧</MenuItem>
          </TextField>
        </Stack>
      )}

      {isNetworkError && (
        <NetworkError
          onRetry={() => {
            setIsNetworkError(false)
            if (query) {
              setPage(1)
            }
          }}
        />
      )}
      {errorMessage && !isNetworkError && (
        <ErrorNotice message={errorMessage} />
      )}

      {!query && !errorMessage && !isNetworkError && (
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            本周热门
          </Typography>
          {isTrendingNetworkError && (
            <NetworkError
              onRetry={() => {
                setIsTrendingNetworkError(false)
                setTrendingRetryKey((prev) => prev + 1)
              }}
            />
          )}
          {isTrendingLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {!isTrendingLoading && trending.length === 0 && !isTrendingNetworkError && (
            <EmptyState
              title="暂无热门数据"
              description="可以先试试搜索功能。"
            />
          )}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(5, minmax(0, 1fr))',
              },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {trending.map(renderMovieCard)}
          </Box>
        </Stack>
      )}

      {query && !isLoading && sortedMovies.length === 0 && !errorMessage && (
        <EmptyState
          title="找不到结果"
          description="换个关键词或调整拼写再试试。"
        />
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(5, minmax(0, 1fr))',
          },
          gap: { xs: 2, sm: 3 },
        }}
      >
        {sortedMovies.map(renderMovieCard)}
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box ref={sentinelRef} sx={{ height: 32 }} />
    </Stack>
  )
}

export default SearchPage
