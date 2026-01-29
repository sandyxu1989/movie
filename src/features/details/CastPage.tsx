import { Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import PosterImage from '../../components/PosterImage'
import { getMovieDetail } from '../../api/tmdb'
import { useEffect, useState } from 'react'
import { CastMember } from '../../types/movie'
import CircularProgress from '@mui/material/CircularProgress'
import ErrorNotice from '../../components/ErrorNotice'
import NetworkError from '../../components/NetworkError'
import { checkNetworkError, getErrorMessage } from '../../utils/error'

const CastPage = () => {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [cast, setCast] = useState<CastMember[]>([])
  const [movieTitle, setMovieTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isNetworkError, setIsNetworkError] = useState(false)

  useEffect(() => {
    const resolvedId = Number(movieId)
    if (!resolvedId) {
      setErrorMessage('无效的电影编号')
      return
    }

    let isActive = true
    const loadCast = async () => {
      setIsLoading(true)
      setErrorMessage('')
      setIsNetworkError(false)
      try {
        const detail = await getMovieDetail(resolvedId)
        if (isActive) {
          setCast(detail.cast)
          setMovieTitle(detail.title)
        }
      } catch (error) {
        if (isActive) {
          if (checkNetworkError(error)) {
            setIsNetworkError(true)
          } else {
            setErrorMessage(getErrorMessage(error, '无法获取演员信息。'))
          }
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadCast()

    return () => {
      isActive = false
    }
  }, [movieId])

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
        }}
      />
    )
  }

  if (errorMessage) {
    return <ErrorNotice message={errorMessage} />
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mb: 2 }}>
          返回
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {movieTitle} - 全部演员
        </Typography>
      </Box>

      {cast.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          暂无演员信息
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
              lg: 'repeat(5, minmax(0, 1fr))',
            },
            gap: 2,
          }}
        >
          {cast.map((actor) => (
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
      )}
    </Stack>
  )
}

export default CastPage
