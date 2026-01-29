import { useEffect, useState } from 'react'
import { MovieSummary, WatchlistItem } from '../types/movie'

const STORAGE_KEY = 'movie_watchlist_v1'

const loadWatchlist = (): WatchlistItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const useWatchlist = () => {
  const [items, setItems] = useState<WatchlistItem[]>(loadWatchlist)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const isInWatchlist = (movieId: number) => {
    return items.some((item) => item.id === movieId)
  }

  const addToWatchlist = (movie: MovieSummary) => {
    setItems((current) => {
      if (current.some((item) => item.id === movie.id)) {
        return current
      }
      return [
        {
          ...movie,
          addedAt: new Date().toISOString(),
        },
        ...current,
      ]
    })
  }

  const removeFromWatchlist = (movieId: number) => {
    setItems((current) => current.filter((item) => item.id !== movieId))
  }

  return {
    items,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
  }
}

export default useWatchlist
