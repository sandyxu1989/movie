import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ErrorNotice from '../../components/ErrorNotice'
import NetworkError from '../../components/NetworkError'
import PosterImage from '../../components/PosterImage'
import { getMovieDetail, getTrailer } from '../../api/tmdb'
import useWatchlist from '../../hooks/useWatchlist'
import { MovieDetail } from '../../types/movie'
import { checkNetworkError, getErrorMessage } from '../../utils/error'

const MovieDetailPage = () => {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isNetworkError, setIsNetworkError] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const { addToWatchlist, isInWatchlist, removeFromWatchlist } =
    useWatchlist()

  useEffect(() => {
    const resolvedId = Number(movieId)
    if (!resolvedId) {
      setErrorMessage('无效的电影编号')
      return
    }

    let isActive = true
    const loadDetail = async () => {
      setIsLoading(true)
      setErrorMessage('')
      setIsNetworkError(false)
      try {
        const detail = await getMovieDetail(resolvedId)
        if (isActive) {
          setMovie(detail)
        }
      } catch (error) {
        if (isActive) {
          if (checkNetworkError(error)) {
            setIsNetworkError(true)
          } else {
            setErrorMessage(getErrorMessage(error, '无法获取电影详情。'))
          }
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadDetail()

    return () => {
      isActive = false
    }
  }, [movieId, retryKey])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isNetworkError) {
    return (
      <NetworkError
        onRetry={() => {
          setIsNetworkError(false)
          setRetryKey((prev) => prev + 1)
        }}
      />
    )
  }

  if (errorMessage) {
    return <ErrorNotice message={errorMessage} />
  }

  if (!movie) {
    return null
  }

  const trailer = getTrailer(movie.videos)
  const isSaved = isInWatchlist(movie.id)

  return (
    <Stack spacing={{ xs: 3, sm: 4 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '5fr 7fr',
            md: '4fr 8fr',
          },
          gap: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: { xs: 'flex', sm: 'block' },
            justifyContent: { xs: 'center', sm: 'flex-start' },
          }}
        >
          <PosterImage
            alt={movie.title}
            src={movie.posterUrl}
            aspectRatio="300 / 450"
          />
        </Box>
        <Box>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="h3"
                fontWeight={700}
                sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
              >
                {movie.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {movie.releaseDate || '未知日期'} •{' '}
                {movie.runtime ? `${movie.runtime} 分钟` : '未知片长'} • ⭐{' '}
                {movie.rating.toFixed(1)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {movie.genres.map((genre) => (
                <Chip key={genre} label={genre} size="small" />
              ))}
            </Stack>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ width: '100%' }}
            >
              <Button
                variant={isSaved ? 'outlined' : 'contained'}
                fullWidth={true}
                onClick={() =>
                  isSaved
                    ? removeFromWatchlist(movie.id)
                    : addToWatchlist(movie)
                }
              >
                {isSaved ? '移除待看' : '加入待看'}
              </Button>
              {trailer && (
                <Button
                  variant="outlined"
                  fullWidth={true}
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                >
                  观看预告片
                </Button>
              )}
            </Stack>
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                简介
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {movie.overview || '暂无简介'}
              </Typography>
            </Box>
            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight={700}>
                导演
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {movie.directors.length
                  ? movie.directors.join(', ')
                  : '未知导演'}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {trailer && (
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            预告片
          </Typography>
          <Box
            component="iframe"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={trailer.name}
            sx={{
              width: '100%',
              border: 0,
              borderRadius: 2,
              aspectRatio: '16 / 9',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      )}

      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            主要演员
          </Typography>
          {movie.cast.length > 5 && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/movie/${movieId}/cast`)}
            >
              查看更多 ({movie.cast.length})
            </Button>
          )}
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(5, minmax(0, 1fr))',
              md: 'repeat(5, minmax(0, 1fr))',
            },
            gap: 2,
          }}
        >
          {movie.cast.slice(0, 5).map((actor) => (
            <Box key={actor.id}>
              <Stack spacing={1}>
                <PosterImage
                  alt={actor.name}
                  src={actor.profileUrl}
                  height={220}
                />
                <Typography variant="subtitle2" fontWeight={600}>
                  {actor.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {actor.character}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
        >
          观众评论
        </Typography>
        {movie.reviews.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            目前没有评论。
          </Typography>
        ) : (
          <Stack spacing={2}>
            {movie.reviews.slice(0, 5).map((review) => (
              <Box
                key={review.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle2" fontWeight={700}>
                  {review.author || '匿名观众'}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {review.content}
                </Typography>
                {review.url && (
                  <Button
                    size="small"
                    href={review.url}
                    target="_blank"
                    sx={{ mt: 1 }}
                  >
                    查看原文
                  </Button>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  )
}

export default MovieDetailPage
