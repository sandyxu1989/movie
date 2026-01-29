export const checkNetworkError = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    return true
  }
  if (error instanceof Error) {
    return (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError')
    )
  }
  return false
}

export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error) {
    return error.message
  }
  return defaultMessage
}
