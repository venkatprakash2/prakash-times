import { useMemo, useState } from 'react'
import { Edit3, Plus, Save, Star, Trash2 } from 'lucide-react'
import Page from '../components/common/Page'
import SectionHeader from '../components/common/SectionHeader'
import { useMovies } from '../context/MovieContext'

const emptyMovie = {
  id: '',
  title: '',
  status: 'Watched',
  rating: 4,
  poster: '',
  review: '',
}

export default function Movies() {
  const { movies, upsertMovie, removeMovie } = useMovies()
  const [filter, setFilter] = useState('All')
  const [editing, setEditing] = useState(emptyMovie)
  const [search, setSearch] = useState('')

  const visibleMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesFilter = filter === 'All' || movie.status === filter
      const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [filter, movies, search])

  const submitMovie = (event) => {
    event.preventDefault()
    if (!editing.title.trim()) return
    upsertMovie({
      ...editing,
      id: editing.id || globalThis.crypto?.randomUUID?.() || `movie-${Date.now()}`,
      poster:
        editing.poster ||
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    })
    setEditing(emptyMovie)
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
            <input className="border border-newsprint/25 bg-newsprint/10 px-4 py-3 outline-none" placeholder="Movie title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <input className="border border-newsprint/25 bg-newsprint/10 px-4 py-3 outline-none" placeholder="Poster image URL" value={editing.poster} onChange={(e) => setEditing({ ...editing, poster: e.target.value })} />
            <select className="border border-newsprint/25 bg-espresso px-4 py-3 outline-none" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
              <option>Watched</option>
              <option>Watchlist</option>
            </select>
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-crema">
              Rating: {editing.rating || 0}
              <input className="mt-3 w-full accent-crema" type="range" min="0" max="5" step="1" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
            </label>
            <textarea className="min-h-28 border border-newsprint/25 bg-newsprint/10 px-4 py-3 outline-none" placeholder="Review or note" value={editing.review} onChange={(e) => setEditing({ ...editing, review: e.target.value })} />
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
