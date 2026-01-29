import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import EmptyState from '../../components/EmptyState'
import MovieCard from '../../components/MovieCard'
import useWatchlist from '../../hooks/useWatchlist'
import { WatchlistItem } from '../../types/movie'

type SortOption = 'addedAt' | 'rating' | 'title'

const WatchlistPage = () => {
  const { items, removeFromWatchlist } = useWatchlist()
  const [sortBy, setSortBy] = useState<SortOption>('addedAt')
  const [selected, setSelected] = useState<WatchlistItem | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [displayTitle, setDisplayTitle] = useState<string>('点击抽选开始')
  const timeoutRef = useRef<number | null>(null)

  const sortedItems = useMemo(() => {
    if (sortBy === 'rating') {
      return [...items].sort(
        (left, right) => right.rating - left.rating,
      )
    }
    if (sortBy === 'title') {
      return [...items].sort((left, right) =>
        left.title.localeCompare(right.title),
      )
    }
    return [...items].sort((left, right) =>
      right.addedAt.localeCompare(left.addedAt),
    )
  }, [items, sortBy])

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleSpin = () => {
    if (items.length === 0 || isSpinning) {
      return
    }

    setIsSpinning(true)
    const result = items[Math.floor(Math.random() * items.length)]
    const duration = 2000
    const startTime = Date.now()
    let count = 0

    const update = () => {
      const elapsed = Date.now() - startTime
      const remaining = duration - elapsed

      if (remaining > 0) {
        const randomItem = items[Math.floor(Math.random() * items.length)]
        setDisplayTitle(randomItem.title)
        
        const delay = Math.max(30, Math.min(50 + count * 10, remaining / 10))
        count++
        timeoutRef.current = window.setTimeout(update, delay)
      } else {
        setIsSpinning(false)
        setDisplayTitle(result.title)
        setSelected(result)
      }
    }

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }
    update()
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          待看清单
        </Typography>
      </Box>

      {items.length > 1 && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Box
                sx={{
                  minHeight: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 2,
                }}
              >
                <Typography variant="h5" textAlign="center">
                  {displayTitle}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleSpin}
                disabled={isSpinning || items.length === 0}
              >
                {isSpinning ? '抽选中...' : '抽选一部要看的电影'}
              </Button>
              {selected && !isSpinning && (
                <Typography textAlign="center" variant="body2" color="text.secondary">
                  {selected.releaseDate} · ⭐ {selected.rating}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          select
          label="排序方式"
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value as SortOption)
          }
          sx={{ width: { xs: '100%', sm: 240 } }}
        >
          <MenuItem value="addedAt">加入时间新到旧</MenuItem>
          <MenuItem value="rating">评分高到低</MenuItem>
          <MenuItem value="title">片名 A → Z</MenuItem>
        </TextField>
      </Stack>

      {items.length === 0 ? (
        <EmptyState
          title="目前没有收藏"
          description="从搜索页面加入喜欢的电影吧。"
        />
      ) : (
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
          {sortedItems.map((movie) => (
            <Box key={movie.id}>
              <MovieCard
                movie={movie}
                action={
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(event) => {
                      event.preventDefault()
                      removeFromWatchlist(movie.id)
                    }}
                  >
                    移除
                  </Button>
                }
              />
            </Box>
          ))}
        </Box>
      )}
    </Stack>
  )
}

export default WatchlistPage
