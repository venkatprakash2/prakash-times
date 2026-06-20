import { createContext, useContext } from 'react'
import { seedMovies } from '../data/movies'
import { useLocalStorage } from '../hooks/useLocalStorage'

const MovieContext = createContext(null)

export function MovieProvider({ children }) {
  const [movies, setMovies] = useLocalStorage('prakash-times-movies', seedMovies)

  const upsertMovie = (movie) => {
    setMovies((current) => {
      const exists = current.some((item) => item.id === movie.id)
      return exists ? current.map((item) => (item.id === movie.id ? movie : item)) : [movie, ...current]
    })
  }

  const removeMovie = (id) => {
    setMovies((current) => current.filter((movie) => movie.id !== id))
  }

  return (
    <MovieContext.Provider value={{ movies, upsertMovie, removeMovie }}>
      {children}
    </MovieContext.Provider>
  )
}

export function useMovies() {
  const context = useContext(MovieContext)
  if (!context) throw new Error('useMovies must be used inside MovieProvider')
  return context
}
