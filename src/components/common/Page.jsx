import { motion } from 'framer-motion'
import { pageVariants } from '../../utils/motion'

export default function Page({ children, className = '' }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12 ${className}`}
    >
      {children}
    </motion.div>
  )
}
