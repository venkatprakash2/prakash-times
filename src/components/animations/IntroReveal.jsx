import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { readStorage, writeStorage } from '../../utils/storage'

export default function IntroReveal() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const seen = readStorage('prakash-times-intro-seen', false)
    if (!seen) setShow(true)
  }, [])

  const enter = () => {
    writeStorage('prakash-times-intro-seen', true)
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-ink p-4 text-newsprint"
        >
          <motion.div
            initial={{ rotateX: 82, y: 80, opacity: 0 }}
            animate={{ rotateX: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl border border-newsprint bg-paper p-6 text-ink shadow-lift md:p-10"
          >
            <div className="coffee-ring absolute right-4 top-4 size-32 opacity-35" />
            <div className="newspaper-rule py-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-coffee">Special Birthday Edition</p>
              <h2 className="mt-4 font-display text-5xl font-black leading-none md:text-8xl">The Prakash Times</h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ink/70">
                A premium Sunday edition folded around family, curiosity, cinema, chess, technology, and the many small stories that make a life feel loved.
              </p>
              <button
                onClick={enter}
                className="mt-8 border border-ink bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.24em] text-newsprint transition hover:bg-coffee"
              >
                Enter newspaper
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
