import { motion } from 'framer-motion'
import { reveal } from '../../utils/motion'

export default function SectionHeader({ kicker, title, copy, align = 'left' }) {
  return (
    <motion.div {...reveal} className={`mb-8 ${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-4xl'}`}>
      {kicker && <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-coffee">{kicker}</p>}
      <h2 className="font-display text-4xl font-black leading-none text-ink md:text-6xl">{title}</h2>
      {copy && <p className="mt-4 max-w-2xl text-base leading-7 text-ink/68 md:text-lg">{copy}</p>}
    </motion.div>
  )
}
