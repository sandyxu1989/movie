import { useEffect, useRef } from 'react'

type UseInfiniteScrollOptions = {
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
}

const useInfiniteScroll = ({
  isLoading,
  hasMore,
  onLoadMore,
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLoading || !hasMore) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        onLoadMore()
      }
    })

    const node = sentinelRef.current
    if (node) {
      observer.observe(node)
    }

    return () => {
      if (node) {
        observer.unobserve(node)
      }
    }
  }, [hasMore, isLoading, onLoadMore])

  return sentinelRef
}

export default useInfiniteScroll
