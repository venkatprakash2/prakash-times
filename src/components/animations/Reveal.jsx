import { motion } from 'framer-motion'
import { reveal } from '../../utils/motion'

export default function Reveal({ children, className = '' }) {
  return (
    <motion.div {...reveal} className={className}>
      {children}
    </motion.div>
  )
}
