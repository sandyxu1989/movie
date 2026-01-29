import { Box, Typography } from '@mui/material'

type EmptyStateProps = {
  title: string
  description?: string
}

const EmptyState = ({ title, description }: EmptyStateProps) => (
  <Box sx={{ textAlign: 'center', py: 8 }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    {description ? (
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    ) : null}
  </Box>
)

export default EmptyState
