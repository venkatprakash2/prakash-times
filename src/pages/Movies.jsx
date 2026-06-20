import { useEffect, useMemo, useState } from 'react'
import { Edit3, Film, Loader2, Plus, Save, Search, Star, Trash2 } from 'lucide-react'
import Page from '../components/common/Page'
import SectionHeader from '../components/common/SectionHeader'
import { useMovies } from '../context/MovieContext'
import { searchMovies } from '../utils/tmdb'

const emptyMovie = {
  id: '',
  title: '',
  status: 'Watched',
  rating: 4,
  poster: '',
  review: '',
  tmdbId: '',
  releaseDate: '',
  overview: '',
  backdrop: '',
}

export default function Movies() {
  const { movies, upsertMovie, removeMovie } = useMovies()
  const [filter, setFilter] = useState('All')
  const [editing, setEditing] = useState(emptyMovie)
  const [search, setSearch] = useState('')
  const [tmdbMatches, setTmdbMatches] = useState([])
  const [tmdbLoading, setTmdbLoading] = useState(false)
  const [tmdbError, setTmdbError] = useState('')
  const [showMatches, setShowMatches] = useState(false)

  const visibleMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesFilter = filter === 'All' || movie.status === filter
      const searchTerm = search.toLowerCase()
      const matchesSearch =
        movie.title.toLowerCase().includes(searchTerm) || (movie.review || '').toLowerCase().includes(searchTerm)
      return matchesFilter && matchesSearch
    })
  }, [filter, movies, search])

  useEffect(() => {
    let active = true
    const query = editing.title.trim()

    if (!query) {
      setTmdbMatches([])
      setTmdbError('')
      setTmdbLoading(false)
      return undefined
    }

    setTmdbLoading(true)
    setTmdbError('')

    const timer = window.setTimeout(async () => {
      try {
        const results = await searchMovies(query)
        if (!active) return
        setTmdbMatches(results.slice(0, 6))
      } catch {
        if (!active) return
        setTmdbMatches([])
        setTmdbError('TMDb lookup failed. You can still save the movie manually.')
      } finally {
        if (active) setTmdbLoading(false)
      }
    }, 350)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [editing.title])

  const chooseMatch = (movie) => {
    setEditing((current) => ({
      ...current,
      title: movie.title,
      poster: movie.poster || current.poster,
      tmdbId: String(movie.id),
      releaseDate: movie.releaseDate || current.releaseDate,
      overview: movie.overview || current.overview,
      backdrop: movie.backdrop || current.backdrop,
    }))
    setTmdbMatches([])
    setShowMatches(false)
  }

  const submitMovie = async (event) => {
    event.preventDefault()
    if (!editing.title.trim()) return

    const posterCandidate = editing.poster || tmdbMatches[0]?.poster || ''
    const exactTmdbMatch = tmdbMatches.find((movie) => movie.title.toLowerCase() === editing.title.trim().toLowerCase())
    const resolvedMatch = exactTmdbMatch || tmdbMatches[0] || null
    const tmdbData = !posterCandidate && editing.title.trim() ? await searchMovies(editing.title.trim()).then((items) => items[0] || null).catch(() => null) : null

    upsertMovie({
      ...editing,
      id: editing.id || globalThis.crypto?.randomUUID?.() || `movie-${Date.now()}`,
      poster:
        posterCandidate ||
        tmdbData?.poster ||
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      tmdbId: editing.tmdbId || String(resolvedMatch?.id || tmdbData?.id || ''),
      releaseDate: editing.releaseDate || resolvedMatch?.releaseDate || tmdbData?.releaseDate || '',
      overview: editing.overview || resolvedMatch?.overview || tmdbData?.overview || '',
      backdrop: editing.backdrop || resolvedMatch?.backdrop || tmdbData?.backdrop || '',
    })
    setEditing(emptyMovie)
    setTmdbMatches([])
    setShowMatches(false)
  }

  const cancelEdit = () => setEditing(emptyMovie)

  return (
    <Page>
      <SectionHeader
        kicker="Movie Journal"
        title="Poster-first cinema notes for watched films and weekend watchlists."
        copy="Add movies, edit ratings, keep reviews, and store the whole journal locally in the browser."
      />
      <section className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
        <form onSubmit={submitMovie} className="h-fit border border-ink bg-ink p-6 text-newsprint shadow-lift">
          <div className="flex items-center gap-3">
            <Plus size={22} />
            <h3 className="font-display text-3xl font-black">{editing.id ? 'Edit movie' : 'Add movie'}</h3>
          </div>
          <div className="mt-6 grid gap-4">
            <div className="relative">
              <div className="flex items-center gap-2 border border-newsprint/25 bg-newsprint/10 px-4 py-3">
                <Search size={16} className="shrink-0 text-crema" />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Movie title"
                  value={editing.title}
                  onChange={(e) => {
                    setShowMatches(true)
                    setEditing({ ...editing, title: e.target.value })
                  }}
                  onFocus={() => setShowMatches(true)}
                />
                {tmdbLoading && <Loader2 size={16} className="animate-spin text-crema" />}
              </div>
              {showMatches && editing.title.trim() && (tmdbMatches.length > 0 || tmdbLoading || tmdbError) && (
                <div className="absolute z-20 mt-2 max-h-80 w-full overflow-auto border border-newsprint/20 bg-ink text-newsprint shadow-lift">
                  {tmdbMatches.map((movie) => (
                    <button
                      key={movie.id}
                      type="button"
                      onClick={() => chooseMatch(movie)}
                      className="flex w-full items-center gap-3 border-b border-newsprint/10 px-4 py-3 text-left transition hover:bg-newsprint/10"
                    >
                      {movie.poster ? <img src={movie.poster} alt="" className="h-14 w-10 object-cover" /> : <Film size={16} className="text-crema" />}
                      <div>
                        <p className="font-semibold">{movie.title}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-newsprint/50">{movie.year || 'Unknown year'}</p>
                      </div>
                    </button>
                  ))}
                  {tmdbLoading && <p className="px-4 py-3 text-sm text-newsprint/70">Searching TMDb...</p>}
                  {tmdbError && <p className="px-4 py-3 text-sm text-newsprint/70">{tmdbError}</p>}
                  {!tmdbLoading && !tmdbError && tmdbMatches.length === 0 && (
                    <p className="px-4 py-3 text-sm text-newsprint/70">No TMDb matches yet.</p>
                  )}
                </div>
              )}
            </div>
            <input
              className="border border-newsprint/25 bg-newsprint/10 px-4 py-3 outline-none"
              placeholder="Poster image URL"
              value={editing.poster}
              onChange={(e) => setEditing({ ...editing, poster: e.target.value })}
            />
            <select className="border border-newsprint/25 bg-espresso px-4 py-3 outline-none" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
              <option>Watched</option>
              <option>Watchlist</option>
            </select>
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-crema">
              Rating: {editing.rating || 0}
              <input className="mt-3 w-full accent-crema" type="range" min="0" max="5" step="1" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
            </label>
            <textarea className="min-h-28 border border-newsprint/25 bg-newsprint/10 px-4 py-3 outline-none" placeholder="Review or note" value={editing.review} onChange={(e) => setEditing({ ...editing, review: e.target.value })} />
            <p className="text-xs leading-5 text-newsprint/55">
              Tip: type a movie title to search TMDb. Selecting a result autofills the poster and keeps the entry richer for later.
            </p>
            <button type="submit" className="flex items-center justify-center gap-2 border border-newsprint px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] transition hover:bg-newsprint hover:text-ink">
              <Save size={16} /> Save locally
            </button>
            {editing.id && (
              <button type="button" onClick={cancelEdit} className="border border-newsprint/30 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-newsprint/80 transition hover:bg-newsprint/10">
                Cancel edit
              </button>
            )}
          </div>
        </form>

        <div>
          <div className="mb-5 flex flex-col gap-3 md:flex-row">
            <input className="flex-1 border border-ink/20 bg-newsprint px-4 py-3 outline-none" placeholder="Search movie journal" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="flex gap-2">
              {['All', 'Watched', 'Watchlist'].map((item) => (
                <button key={item} type="button" onClick={() => setFilter(item)} className={`px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] ${filter === item ? 'bg-ink text-newsprint' : 'bg-newsprint text-ink/70'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <section className="grid gap-5 md:grid-cols-2">
            {visibleMovies.map((movie) => (
              <article key={movie.id} className="group overflow-hidden border border-ink/15 bg-newsprint shadow-paper">
                <img src={movie.poster} alt="" className="h-80 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-burgundy">{movie.status}</p>
                      <h3 className="mt-2 font-display text-3xl font-black">{movie.title}</h3>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={16} fill={index < movie.rating ? '#b88b38' : 'none'} className="text-gold" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink/68">{movie.review}</p>
                  {(movie.releaseDate || movie.tmdbId) && (
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-coffee">
                      {movie.releaseDate ? `Released ${movie.releaseDate}` : 'TMDb linked'}
                    </p>
                  )}
                  <div className="mt-5 flex gap-2">
                    <button type="button" className="grid size-10 place-items-center border border-ink/20" onClick={() => setEditing({ ...movie })} aria-label={`Edit ${movie.title}`}>
                      <Edit3 size={16} />
                    </button>
                    <button type="button" className="grid size-10 place-items-center border border-ink/20" onClick={() => removeMovie(movie.id)} aria-label={`Remove ${movie.title}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </section>
    </Page>
  )
}
