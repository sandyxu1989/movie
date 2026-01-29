import { Box } from '@mui/material'
import { useState } from 'react'

type PosterImageProps = {
  alt: string
  src: string | null
  aspectRatio?: string
  height?: number
}

const PosterImage = ({
  alt,
  src,
  aspectRatio,
  height,
}: PosterImageProps) => {
  const [hasError, setHasError] = useState(false)
  const resolvedSrc =
    !hasError && src
      ? src
      : 'https://via.placeholder.com/500x750?text=No+Image'

  return (
    <Box
      component="img"
      alt={alt}
      src={resolvedSrc}
      loading="lazy"
      onError={() => setHasError(true)}
      sx={{
        width: '100%',
        ...(aspectRatio
          ? { aspectRatio, objectFit: 'cover' }
          : height
            ? { height, objectFit: 'cover' }
            : { aspectRatio: '2 / 3', objectFit: 'cover' }),
        borderRadius: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
      }}
    />
  )
}

export default PosterImage
