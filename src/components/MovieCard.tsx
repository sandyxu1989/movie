import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from '@mui/material'
import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import PosterImage from './PosterImage'
import { MovieSummary } from '../types/movie'

type MovieCardProps = {
  movie: MovieSummary
  action?: ReactNode
}

const MovieCard = ({ movie, action }: MovieCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardActionArea component={RouterLink} to={`/movie/${movie.id}`}>
      <PosterImage
        alt={movie.title}
        src={movie.posterUrl}
        aspectRatio="180 / 273"
      />
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom noWrap>
          {movie.title}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {movie.releaseDate || '未知年份'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ⭐ {movie.rating.toFixed(1)}
          </Typography>
        </Stack>
      </CardContent>
    </CardActionArea>
    {action && <CardContent>{action}</CardContent>}
  </Card>
)

export default MovieCard
