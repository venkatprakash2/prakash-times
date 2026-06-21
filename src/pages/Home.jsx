import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clapperboard, Crown, Newspaper } from 'lucide-react'
import Page from '../components/common/Page'
import Masthead from '../components/newspaper/Masthead'
import Reveal from '../components/animations/Reveal'
import { memories } from '../data/memories'
import { leadershipProfile, leadershipTimeline } from '../data/leadership'
import { defaultChessUsername } from '../data/chess'
import { useMovies } from '../context/MovieContext'
import { loadChessProfileSnapshot } from '../utils/chessSummary'

function HighlightCard({ to, label, title, copy, icon: Icon, image, meta }) {
  return (
    <Link to={to} className="group block border border-newsprint/18 bg-ink/45 p-4 text-newsprint transition hover:bg-ink/62">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-crema">{label}</p>
          <h3 className="mt-2 truncate font-display text-3xl font-black leading-none">{title}</h3>
        </div>
        <Icon size={20} className="shrink-0 text-crema" />
      </div>
      {image && <img src={image} alt="" className="mt-4 h-44 w-full rounded-sm bg-paper/10 object-contain p-2 grayscale-[12%] transition duration-500 group-hover:scale-[1.02]" />}
      <p className="mt-3 text-sm leading-6 text-newsprint/74">{copy}</p>
      {meta && <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-crema/85">{meta}</p>}
    </Link>
  )
}

function TallMovieCard({ movie }) {
  return (
    <Link to="/movies" className="group flex h-full min-h-[780px] flex-col overflow-hidden border border-ink bg-ink text-newsprint shadow-lift">
      <div className="relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/30 to-ink/85" />
        {movie?.poster ? <img src={movie.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.01]" /> : null}
        <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-crema">Top movie</p>
              <h3 className="mt-2 font-display text-4xl font-black leading-none">{movie?.title ?? 'Movie journal'}</h3>
            </div>
            <Clapperboard size={20} className="shrink-0 text-crema" />
          </div>
          <div className="mt-auto">
            <p className="max-w-sm text-sm leading-6 text-newsprint/78">
              {movie?.review || 'The movie journal keeps the latest favorite at the front.'}
            </p>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-crema/85">
              {movie ? `${movie.status} / ${movie.rating}/5` : 'No movie yet'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

function ChessSummary({ snapshot, loading, error, username }) {
  const summary = snapshot?.profile
  const stats = [
    { label: 'Joined', value: summary?.joined ? new Date(summary.joined * 1000).getFullYear().toString() : '—' },
    { label: 'Followers', value: String(summary?.followers ?? '—') },
    { label: 'FIDE', value: String(summary?.fide ?? '—') },
    { label: 'Status', value: summary?.status || '—' },
    { label: 'Streak', value: loading ? 'Loading…' : snapshot?.streak?.days ? `${snapshot.streak.days}-day streak` : 'No active streak' },
    { label: 'Games', value: snapshot?.games?.length ? String(snapshot.games.length) : '—' },
  ]

  return (
    <Reveal className="border border-ink bg-ink p-6 text-newsprint shadow-lift">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-crema">Live Summary</p>
      {loading && (
        <div className="mt-6 flex items-center gap-3 text-newsprint/70">
          <span className="size-4 animate-spin rounded-full border-2 border-newsprint/40 border-t-newsprint" />
          <span>Loading public Chess.com data...</span>
        </div>
      )}
      {!loading && snapshot?.profile && (
        <div className="mt-5 grid gap-5">
          <div>
            <h2 className="font-display text-5xl font-black leading-none">{snapshot.profile.username}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-crema">{snapshot.profile.location || 'Chess.com player profile'}</p>
            <p className="mt-6 text-lg text-newsprint/78">{snapshot.profile.name || snapshot.profile.title || 'Public profile and stats loaded from Chess.com.'}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="min-h-28 border border-newsprint/18 bg-ink/92 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-crema">{stat.label}</p>
                <p className="mt-4 font-display text-3xl font-black leading-none">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {!loading && !snapshot?.profile && (
        <p className="mt-6 text-sm leading-7 text-newsprint/72">
          {error || `Attach or select @${username} to load the live Chess.com summary.`}
        </p>
      )}
    </Reveal>
  )
}

export default function Home() {
  const { movies } = useMovies()
  const [chessSnapshot, setChessSnapshot] = useState(null)
  const [chessError, setChessError] = useState('')
  const [chessLoading, setChessLoading] = useState(true)

  const featuredMemory = memories.find((item) => item.cluster === 'Celebrations') ?? memories[0]
  const currentRole = leadershipTimeline[0]

  const topMovie = useMemo(() => {
    const watched = movies.filter((movie) => movie.status === 'Watched')
    const sorted = [...watched].sort((left, right) => {
      const ratingDiff = (Number(right.rating) || 0) - (Number(left.rating) || 0)
      if (ratingDiff !== 0) return ratingDiff
      return movies.indexOf(left) - movies.indexOf(right)
    })
    return sorted[0] ?? movies[0] ?? null
  }, [movies])

  useEffect(() => {
    let active = true

    async function loadChessSummary() {
      setChessLoading(true)
      setChessError('')

      try {
        const snapshot = await loadChessProfileSnapshot(defaultChessUsername)
        if (!active) return
        setChessSnapshot(snapshot)
      } catch {
        if (!active) return
        setChessSnapshot(null)
        setChessError('Chess.com data is currently unavailable.')
      } finally {
        if (active) setChessLoading(false)
      }
    }

    loadChessSummary()
    return () => {
      active = false
    }
  }, [])

  return (
    <Page widthClassName="max-w-[1460px]" paddingClassName="px-4 py-4 lg:px-6 lg:py-4">
      <Masthead edition="Front Page Briefing" />

      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-5 pt-2 text-center md:mb-6 md:pt-3 lg:mb-7 lg:pt-4">
          <h2 className="font-display text-3xl font-black leading-none md:text-4xl lg:text-5xl">Headlines</h2>
        </div>

        <section className="grid w-full gap-4 lg:grid-cols-[1.05fr_.95fr]">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <HighlightCard
                to="/memories"
                label="Memory"
                title={featuredMemory.title}
                copy={featuredMemory.story}
                meta={`${featuredMemory.cluster} / ${featuredMemory.location}`}
                icon={Newspaper}
              />
              <HighlightCard
                to="/leadership"
                label="Current role"
                title={leadershipProfile.headline}
                copy={currentRole.note}
                meta={leadershipProfile.location}
                icon={Crown}
              />
            </div>
            <ChessSummary snapshot={chessSnapshot} loading={chessLoading} error={chessError} username={defaultChessUsername} />
          </div>
          <TallMovieCard movie={topMovie} />
        </section>
      </div>
    </Page>
  )
}
