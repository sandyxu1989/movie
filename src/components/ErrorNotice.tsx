import { Box, Typography } from '@mui/material'

type ErrorNoticeProps = {
  title?: string
  message: string
}

const ErrorNotice = ({ title = '发生错误', message }: ErrorNoticeProps) => (
  <Box
    sx={{
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'error.main',
      p: 2,
      backgroundColor: 'rgba(244, 67, 54, 0.08)',
    }}
  >
    <Typography variant="subtitle1" color="error.main" fontWeight={700}>
      {title}
    </Typography>
    <Typography
      variant="body2"
      sx={{ mt: 1, color: 'error.main', whiteSpace: 'pre-wrap' }}
    >
      {message}
    </Typography>
  </Box>
)

export default ErrorNotice
