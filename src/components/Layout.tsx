import type { ButtonProps } from '@mui/material'
import type { LinkProps } from 'react-router-dom'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'

type NavButtonProps = ButtonProps & LinkProps

const NavButton = styled(Button)<NavButtonProps>(({ theme }) => ({
  color: theme.palette.common.white,
  textTransform: 'none',
  fontWeight: 600,
}))

const Layout = () => {
  const location = useLocation()

  return (
    <Box
      sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Container
            maxWidth="lg"
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: { xs: 0, sm: 3 },
            }}
          >
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}
            >
              TMDB Movie
            </Typography>
            <Stack direction="row" spacing={1}>
              <NavButton
                component={RouterLink}
                to="/"
                variant={location.pathname === '/' ? 'outlined' : 'text'}
              >
                搜索
              </NavButton>
              <NavButton
                component={RouterLink}
                to="/watchlist"
                variant={
                  location.pathname.startsWith('/watchlist')
                    ? 'outlined'
                    : 'text'
                }
              >
                待看清单
              </NavButton>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          py: { xs: 3, md: 4 },
          px: { xs: 2, sm: 3 },
          width: '100%',
        }}
      >
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: 'center',
          color: 'text.secondary',
          fontSize: 12,
        }}
      >
        Powered by TMDB
      </Box>
    </Box>
  )
}

export default Layout
