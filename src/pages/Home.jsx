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
      {image && <img src={image} alt="" className="mt-4 h-28 w-full object-cover grayscale-[12%] transition duration-500 group-hover:scale-[1.02]" />}
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
    ? 'Loading streak...'
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
    <Page>
      <Masthead edition="Front Page Briefing" />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <Reveal className="relative min-h-[640px] overflow-hidden border border-ink bg-ink text-newsprint shadow-lift">
          <img src={featuredMemory.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-68 grayscale-[16%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/44 to-transparent" />
          <div className="relative flex min-h-[640px] flex-col justify-between p-6 md:p-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-crema">Folded front page</p>
              <h2 className="mt-4 font-display text-5xl font-black leading-none md:text-7xl">
                One memory, one role, one movie, one chess streak.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-newsprint/76 md:text-lg">
                This home page is intentionally compact. Use the navbar to open the paper, and keep this front page as the curated summary of what matters today.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
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

        <Reveal className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">Front Page Notes</p>
          <h3 className="mt-4 font-display text-4xl font-black leading-tight">
            The paper is folded. The navbar opens the sections.
          </h3>
          <p className="mt-4 text-sm leading-7 text-ink/68">
            The site now starts with a single-screen briefing instead of a sampler from every section. Memories, leadership, movies, and chess stay visible without cluttering the first view.
          </p>
          <div className="mt-6 grid gap-3">
            <div className="border border-ink/15 bg-paper p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-coffee">Editorial focus</p>
              <p className="mt-2 text-sm leading-6 text-ink/72">Coffee accents stay subtle and consistent across the site so the paper feels hand-crafted rather than busy.</p>
            </div>
            <div className="border border-ink/15 bg-paper p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-coffee">Chess data</p>
              <p className="mt-2 text-sm leading-6 text-ink/72">
                The Chess.com panel uses the public profile for <strong>@{defaultChessUsername}</strong> and derives the streak from recent archived games.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.24em] text-ink/50"
      >
        Use the navbar to move through the edition.
      </motion.p>
    </Page>
  )
}
