import { describe, expect, it } from 'vitest'
import { getTrailer } from './tmdb'

describe('getTrailer', () => {
  it('should return YouTube trailer when available', () => {
    const trailer = getTrailer([
      {
        id: '1',
        key: 'abc',
        site: 'YouTube',
        name: 'Official Trailer',
        type: 'Trailer',
      },
      {
        id: '2',
        key: 'def',
        site: 'YouTube',
        name: 'Teaser',
        type: 'Teaser',
      },
    ])

    expect(trailer?.key).toBe('abc')
  })

  it('should return null when no trailer matches', () => {
    const trailer = getTrailer([
      {
        id: '3',
        key: 'ghi',
        site: 'Vimeo',
        name: 'Clip',
        type: 'Clip',
      },
    ])

    expect(trailer).toBeNull()
  })
})
