import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#0f1115',
      paper: '#161a22',
    },
  },
  typography: {
    fontFamily: '"Inter", "Noto Sans TC", system-ui, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
})
