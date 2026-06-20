import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Shell from './components/layout/Shell'
import { routes } from './routes/routes'
import { MovieProvider } from './context/MovieContext'

export default function App() {
  const location = useLocation()

  return (
    <MovieProvider>
      <Shell>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/gallery" element={<Navigate to="/memories?view=gallery" replace />} />
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </AnimatePresence>
      </Shell>
    </MovieProvider>
  )
}
