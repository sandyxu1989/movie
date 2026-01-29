const CACHE_PREFIX = 'tmdb_cache_'
const CACHE_EXPIRES = 24 * 60 * 60 * 1000

type CacheItem<T> = {
  data: T
  timestamp: number
}

const getCacheKey = (key: string) => `${CACHE_PREFIX}${key}`

export const setCache = <T>(key: string, data: T) => {
  try {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(getCacheKey(key), JSON.stringify(item))
  } catch (error) {
    console.warn('缓存写入失败:', error)
  }
}

export const getCache = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(getCacheKey(key))
    if (!cached) {
      return null
    }

    const item: CacheItem<T> = JSON.parse(cached)
    if (Date.now() - item.timestamp > CACHE_EXPIRES) {
      localStorage.removeItem(getCacheKey(key))
      return null
    }

    return item.data
  } catch {
    return null
  }
}
