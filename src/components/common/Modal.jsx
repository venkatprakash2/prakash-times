import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ item, onClose, children }) {
  if (!item) return null
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-h-[88vh] w-full max-w-3xl overflow-auto border border-ink bg-newsprint shadow-lift"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 flex justify-end bg-newsprint/88 p-3 backdrop-blur">
          <button className="grid size-10 place-items-center border border-ink/25" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}
