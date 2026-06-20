import Page from '../components/common/Page'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/animations/Reveal'
import { chessGames, chessStats } from '../data/chess'

export default function Chess() {
  return (
    <Page>
      <SectionHeader
        kicker="Chess Sports Desk"
        title="Rapid games, quiet pressure, and the art of waiting one move longer."
        copy="A sports-section treatment for chess: profile notes, statistics, favorite games, and annotated match stories."
      />
      <section className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
        <Reveal className="border border-ink bg-ink p-6 text-newsprint shadow-lift">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-crema">Player Profile</p>
          <h2 className="mt-4 font-display text-5xl font-black leading-none">Prakash, positional correspondent.</h2>
          <p className="mt-5 text-sm leading-7 text-newsprint/72">
            Prefers steady development, practical endgames, and positions where a small advantage can become a headline.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {chessStats.map((stat) => (
              <div key={stat.label} className="border border-newsprint/18 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-crema">{stat.label}</p>
                <p className="mt-2 font-display text-2xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {chessGames.map((game) => (
            <Reveal key={game.title} className="overflow-hidden border border-ink/15 bg-newsprint shadow-paper">
              <img src={game.image} alt="" className="h-56 w-full object-cover grayscale-[15%]" />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-burgundy">{game.result} / {game.opponent}</p>
                <h3 className="mt-3 font-display text-3xl font-black">{game.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/68">{game.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="mt-14 border-y border-ink py-8">
        <div className="grid grid-cols-8 gap-1 sm:grid-cols-8">
          {Array.from({ length: 64 }).map((_, index) => (
            <div key={index} className={`aspect-square ${Math.floor(index / 8) % 2 === index % 2 ? 'bg-newsprint' : 'bg-coffee/70'}`} />
          ))}
        </div>
      </section>
    </Page>
  )
}
