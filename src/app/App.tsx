import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import MovieDetailPage from '../features/details/MovieDetailPage'
import CastPage from '../features/details/CastPage'
import SearchPage from '../features/search/SearchPage'
import WatchlistPage from '../features/watchlist/WatchlistPage'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<SearchPage />} />
        <Route path="movie/:movieId" element={<MovieDetailPage />} />
        <Route path="movie/:movieId/cast" element={<CastPage />} />
        <Route path="watchlist" element={<WatchlistPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default App
