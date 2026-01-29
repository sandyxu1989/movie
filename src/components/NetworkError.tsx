import { Box, Button, Stack, Typography } from '@mui/material'
import { Refresh } from '@mui/icons-material'

type NetworkErrorProps = {
  onRetry?: () => void
}

const NetworkError = ({ onRetry }: NetworkErrorProps) => (
  <Box
    sx={{
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      p: 3,
      backgroundColor: 'background.paper',
      textAlign: 'center',
    }}
  >
    <Stack spacing={2} alignItems="center">
      <Typography variant="body1" color="text.secondary">
        网络连接不佳
      </Typography>
      <Typography variant="body2" color="text.secondary">
        请检查网络后重试
      </Typography>
      {onRetry ? (
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRetry}
          size="small"
        >
          重新尝试
        </Button>
      ) : null}
    </Stack>
  </Box>
)

export default NetworkError
