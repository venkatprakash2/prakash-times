import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function EditorialCard({ item, large = false, onClick, actionLabel = 'Read' }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={`group overflow-hidden border border-ink/15 bg-newsprint/78 shadow-paper ${large ? 'md:col-span-2' : ''}`}
    >
      <button type="button" onClick={onClick} className="block h-full w-full text-left">
        <div className={large ? 'grid h-full md:grid-cols-[1.2fr_.8fr]' : ''}>
          <img src={item.image} alt="" className={`h-64 w-full object-cover grayscale-[15%] ${large ? 'md:h-full' : ''}`} />
          <div className="flex min-h-64 flex-col p-5">
            {item.category && (
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-burgundy">{item.category}</p>
            )}
            <h3 className="font-display text-2xl font-black leading-tight md:text-3xl">{item.headline || item.title}</h3>
            <p className="mt-3 clamp-3 text-sm leading-6 text-ink/68">{item.summary || item.story || item.copy || item.note}</p>
            <div className="mt-auto flex items-center justify-between pt-5 text-xs font-bold uppercase tracking-[0.18em] text-coffee">
              <span>{item.source || item.location || item.year || actionLabel}</span>
              <ArrowUpRight size={18} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>
        </div>
      </button>
    </motion.article>
  )
}
