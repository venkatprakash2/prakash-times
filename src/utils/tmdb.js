const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w780'

function getAuthHeaders() {
  const token = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN
  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (token) {
    return { Authorization: `Bearer ${token}` }
  }

  return apiKey ? { 'X-API-Key': apiKey } : {}
}

async function tmdbFetch(path, searchParams = {}) {
  const url = new URL(`https://api.themoviedb.org/3/${path}`)
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error(`TMDb request failed: ${response.status}`)
  }

  return response.json()
}

export async function searchMovies(query) {
  if (!query?.trim()) return []

  const data = await tmdbFetch('search/movie', {
    query,
    include_adult: 'false',
    language: 'en-US',
    page: '1',
  })

  return (data.results || []).map((movie) => ({
    id: movie.id,
    title: movie.title || movie.original_title || query,
    year: movie.release_date ? movie.release_date.slice(0, 4) : '',
    poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : '',
    backdrop: movie.backdrop_path ? `${TMDB_BACKDROP_BASE}${movie.backdrop_path}` : '',
    overview: movie.overview || '',
    releaseDate: movie.release_date || '',
    popularity: movie.popularity || 0,
  }))
}

export async function fetchMovieDetails(movieId) {
  if (!movieId) return null

  const movie = await tmdbFetch(`movie/${movieId}`, {
    language: 'en-US',
    append_to_response: 'credits,keywords,release_dates',
  })

  return {
    id: movie.id,
    title: movie.title || movie.original_title,
    year: movie.release_date ? movie.release_date.slice(0, 4) : '',
    poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : '',
    backdrop: movie.backdrop_path ? `${TMDB_BACKDROP_BASE}${movie.backdrop_path}` : '',
    overview: movie.overview || '',
    releaseDate: movie.release_date || '',
    tagline: movie.tagline || '',
  }
}
