import { ExternalLink } from 'lucide-react'
import Page from '../components/common/Page'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/animations/Reveal'
import { aiTools } from '../data/aiTools'

export default function AiTechnology() {
  return (
    <Page>
      <SectionHeader
        kicker="AI & Technology"
        title="The technology desk, written for usefulness rather than hype."
        copy="AI appears here as an editor's shelf of practical tools, wrapped in a vintage newspaper structure with a modern signal underneath."
      />
      <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <Reveal className="relative min-h-[520px] overflow-hidden border border-ink bg-ink p-8 text-newsprint shadow-lift">
          <img src={aiTools[0].image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-38 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
          <div className="relative max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-crema">Editor's Recommendation</p>
            <h2 className="mt-5 font-display text-6xl font-black leading-none">{aiTools[0].name}</h2>
            <p className="mt-5 text-lg leading-8 text-newsprint/76">{aiTools[0].bestFor}</p>
            <a href={aiTools[0].link} className="mt-8 inline-flex items-center gap-2 border border-newsprint/70 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em]">
              Visit tool <ExternalLink size={16} />
            </a>
          </div>
        </Reveal>
        <div className="grid gap-6">
          {aiTools.slice(1, 3).map((tool) => (
            <ToolCard key={tool.name} tool={tool} compact />
          ))}
        </div>
      </section>
      <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aiTools.slice(3).map((tool) => (
          <ToolCard key={tool.name} tool={tool} />
        ))}
      </section>
    </Page>
  )
}

function ToolCard({ tool, compact = false }) {
  return (
    <Reveal className="overflow-hidden border border-ink/15 bg-newsprint/78 shadow-paper">
      <img src={tool.image} alt="" className={`w-full object-cover grayscale-[12%] ${compact ? 'h-40' : 'h-52'}`} />
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-burgundy">{tool.category}</p>
        <h3 className="mt-3 font-display text-3xl font-black">{tool.name}</h3>
        <p className="mt-3 text-sm leading-6 text-ink/68">{tool.bestFor}</p>
        <a href={tool.link} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-coffee">
          Open <ExternalLink size={14} />
        </a>
      </div>
    </Reveal>
  )
}
