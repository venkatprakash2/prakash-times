import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Clapperboard, Cpu, Crown, Newspaper, Trophy } from 'lucide-react'
import Page from '../components/common/Page'
import Masthead from '../components/newspaper/Masthead'
import EditorialCard from '../components/cards/EditorialCard'
import Reveal from '../components/animations/Reveal'
import { memories } from '../data/memories'
import { newsEntries } from '../data/news'
import { aiTools } from '../data/aiTools'
import { chessGames } from '../data/chess'
import { birthdays } from '../data/birthdays'
import { careerMilestones, leadershipQuotes } from '../data/career'

const sectionLinks = [
  { to: '/memories', label: 'Memories', icon: Newspaper, copy: 'Scrapbook stories, family dispatches, and warm visual notes.' },
  { to: '/leadership', label: 'Leadership', icon: Crown, copy: 'A magazine feature on professional calm and clear judgment.' },
  { to: '/movies', label: 'Movies', icon: Clapperboard, copy: 'A poster-first journal for ratings, reviews, and watchlists.' },
  { to: '/ai-technology', label: 'AI & Tech', icon: Cpu, copy: 'Editor-picked tools without turning the paper into a dashboard.' },
  { to: '/chess', label: 'Chess', icon: Trophy, copy: 'Sports-page coverage for games, stats, and favorite positions.' },
  { to: '/birthdays', label: 'Birthdays', icon: CalendarDays, copy: 'Celebrations shaped as event cards and timelines.' },
]

export default function Home() {
  const hero = memories.find((item) => item.cluster === 'Celebrations') ?? memories[0]
  const leadNews = newsEntries.find((item) => item.category === 'Technology') ?? newsEntries[0]
  const secondaryNews = newsEntries.find((item) => item.category === 'Business') ?? newsEntries[1] ?? newsEntries[0]
  const memoryFeature = memories.find((item) => item.cluster === 'Travel Notes') ?? memories[1] ?? memories[0]
  const memorySpotlight = memories.find((item) => item.cluster === 'Celebrations' && item.id !== hero.id) ?? memories[2] ?? memories[0]
  const cinemaBirth = birthdays.find((item) => item.type === 'Birthday') ?? birthdays[0]
  const featuredQuote = leadershipQuotes[2] ?? leadershipQuotes[0]
  const featuredMilestone = careerMilestones[2] ?? careerMilestones[0]
  const aiPick = aiTools.find((item) => item.category === 'Answer Engine') ?? aiTools[0]
  const chessPick = chessGames.find(Boolean) ?? chessGames[0]
  const techPick = aiTools.find((item) => item.category === 'Presentation Desk') ?? aiTools[3] ?? aiTools[0]

  return (
    <Page>
      <Masthead />
      <section className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative min-h-[560px] overflow-hidden border border-ink bg-ink text-newsprint shadow-lift"
        >
          <img src={hero.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-72 grayscale-[18%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
          <div className="coffee-ring absolute right-8 top-8 size-32 opacity-70" />
          <div className="relative flex h-full min-h-[560px] flex-col justify-end p-6 md:p-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-crema">Front Page Lead</p>
            <h2 className="max-w-3xl font-display text-5xl font-black leading-none md:text-7xl">
              A Sunday edition made for one reader.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-newsprint/78">
              Family memories, sharp current affairs, cinema notes, chess coverage, birthdays, and the useful parts of AI, all folded into one premium personal newspaper.
            </p>
            <Link
              to="/memories"
              className="mt-7 w-fit border border-newsprint/70 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] transition hover:bg-newsprint hover:text-ink"
            >
              Open the scrapbook
            </Link>
          </div>
        </motion.div>
        <div className="grid gap-6">
          <EditorialCard item={{ ...leadNews, title: leadNews.headline }} />
          <article className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">Leadership Editorial</p>
            <blockquote className="mt-5 font-display text-4xl font-black leading-tight">
              “{featuredQuote}”
            </blockquote>
            <p className="mt-5 text-sm leading-6 text-ink/68">{featuredMilestone.copy}</p>
          </article>
        </div>
      </section>

      <Reveal className="mt-14 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {sectionLinks.map(({ to, label, icon: Icon, copy }) => (
          <Link key={to} to={to} className="group border border-ink/15 bg-newsprint/72 p-4 transition hover:-translate-y-1 hover:bg-ink hover:text-newsprint">
            <Icon size={22} />
            <h3 className="mt-5 font-display text-2xl font-black">{label}</h3>
            <p className="mt-2 text-sm leading-5 opacity-70">{copy}</p>
          </Link>
        ))}
      </Reveal>

      <section className="mt-16 grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <EditorialCard item={{ ...memoryFeature, headline: memoryFeature.title, summary: memoryFeature.story }} large />
        </div>
        <div className="border border-ink bg-ink p-6 text-newsprint">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-crema">Cinema Highlight</p>
          <h3 className="mt-4 font-display text-4xl font-black">A watchlist with room for debate.</h3>
          <p className="mt-4 text-sm leading-6 text-newsprint/72">
            Ratings and reviews live locally in the browser, ready for weekend recommendations and post-movie verdicts.
          </p>
          <Link to="/movies" className="mt-6 inline-block border border-newsprint/60 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em]">
            Visit movie journal
          </Link>
        </div>
        <div className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">Upcoming</p>
          <h3 className="mt-4 font-display text-4xl font-black">{cinemaBirth?.date ?? 'Coming up'}</h3>
          <p className="mt-4 text-sm leading-6 text-ink/68">{cinemaBirth?.mood ?? 'A family date worth keeping on the front page.'}</p>
        </div>
      </section>

      <section className="mt-16 columns-1 gap-6 md:columns-2 lg:columns-3">
        {[newsEntries[0], aiPick, chessPick, memorySpotlight, secondaryNews, techPick, memoryFeature].filter(Boolean).map((item, index) => (
          <Reveal key={`${item.title || item.name}-${index}`} className="mb-6 break-inside-avoid border border-ink/15 bg-newsprint/78 p-5 shadow-paper">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-coffee">{item.category || item.cluster || item.result || 'Editors Desk'}</p>
            <h3 className="mt-3 font-display text-3xl font-black leading-tight">{item.headline || item.title || item.name}</h3>
            <p className="mt-3 text-sm leading-6 text-ink/68">{item.summary || item.story || item.bestFor || item.note}</p>
          </Reveal>
        ))}
      </section>
    </Page>
  )
}
