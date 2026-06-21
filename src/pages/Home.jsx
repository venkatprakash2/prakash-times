import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clapperboard, Crown, Newspaper, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
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

  const chessSummaryText = chessLoading
    ? 'Loading profile...'
    : chessSnapshot?.streak?.days
      ? `${chessSnapshot.streak.days}-day playing streak`
      : 'No active streak yet'

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
      <div className="mx-auto w-full max-w-[1280px]">
        <Masthead edition="Front Page Briefing" />

        <section className="grid gap-4 lg:grid-cols-[1.45fr_.55fr] 2xl:grid-cols-[1.55fr_.45fr]">
          <Reveal className="relative min-h-[430px] overflow-hidden border border-ink bg-ink text-newsprint shadow-lift">
            <img src={featuredMemory.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-68 grayscale-[16%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/44 to-transparent" />
            <div className="relative flex min-h-[430px] flex-col justify-between p-4 md:p-6">
              <div className="mx-auto w-full max-w-3xl text-center">
                <h2 className="font-display text-3xl font-black leading-none md:text-4xl lg:text-5xl">Headlines</h2>
              </div>

              <div className="mx-auto grid w-full max-w-5xl gap-3 sm:grid-cols-2 xl:max-w-6xl">
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
                <HighlightCard
                  to="/movies"
                  label="Top movie"
                  title={topMovie?.title ?? 'Movie journal'}
                  copy={topMovie?.review || 'The movie journal keeps the latest favorite at the front.'}
                  image={topMovie?.poster}
                  meta={topMovie ? `${topMovie.status} / ${topMovie.rating}/5` : 'No movie yet'}
                  icon={Clapperboard}
                />
                <HighlightCard
                  to="/chess"
                  label="Chess.com"
                  title={chessSummaryText}
                  copy={chessSnapshot?.profile?.title || chessSnapshot?.profile?.location || 'Public profile and recent archive pulled from Chess.com.'}
                  meta={chessSnapshot ? `@${defaultChessUsername} / ${chessSnapshot?.games?.length ?? 0} games scanned` : chessError || `@${defaultChessUsername}`}
                  icon={Trophy}
                />
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </Page>
  )
}
