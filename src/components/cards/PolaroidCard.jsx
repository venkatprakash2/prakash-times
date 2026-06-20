import { motion } from 'framer-motion'

export default function PolaroidCard({ memory, rotate = 0, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={{ rotate: 0, scale: 1.03, y: -8 }}
      style={{ rotate }}
      onClick={onClick}
      className="bg-newsprint p-3 pb-7 text-left shadow-lift"
    >
      <img src={memory.image} alt="" className="h-56 w-full object-cover grayscale-[10%]" />
      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coffee">{memory.date} / {memory.cluster}</p>
        <h3 className="mt-2 font-display text-2xl font-black">{memory.title}</h3>
      </div>
    </motion.button>
  )
}
