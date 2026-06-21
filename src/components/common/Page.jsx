import { motion } from 'framer-motion'
import { pageVariants } from '../../utils/motion'

export default function Page({
  children,
  className = '',
  widthClassName = 'max-w-7xl',
  paddingClassName = 'px-4 py-8 lg:px-8 lg:py-12',
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative mx-auto w-full ${widthClassName} ${paddingClassName} ${className}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute right-4 top-6 hidden opacity-35 lg:block">
        <div className="relative h-24 w-28">
          <div className="coffee-splatter absolute inset-0 rounded-[42%] blur-[0.2px]" />
          <div className="absolute right-5 top-6 h-10 w-12 rounded-b-[14px] rounded-t-[8px] border border-coffee/45 bg-paper/60 shadow-[inset_0_0_0_1px_rgba(255,250,240,0.42)]" />
          <div className="absolute right-2 top-8 h-4 w-4 rounded-full border border-coffee/40" />
          <div className="absolute right-7 top-1 flex gap-1">
            <span className="h-8 w-[2px] rounded-full bg-coffee/28" />
            <span className="mt-1 h-6 w-[2px] rounded-full bg-coffee/20" />
            <span className="mt-0.5 h-7 w-[2px] rounded-full bg-coffee/24" />
          </div>
        </div>
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  )
}
