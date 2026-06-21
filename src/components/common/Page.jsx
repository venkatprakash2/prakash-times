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
        <div className="relative h-28 w-32">
          <div className="coffee-splatter absolute left-0 top-4 h-20 w-20 rounded-[42%] blur-[0.2px]" />
          <div className="absolute bottom-3 left-6 h-10 w-14 rounded-b-[15px] rounded-t-[10px] border border-coffee/55 bg-paper/78 shadow-[inset_0_-8px_14px_rgba(124,81,48,0.14)]" />
          <div className="absolute bottom-9 left-8 h-2 w-10 rounded-full bg-[#4c2e1c]/80" />
          <div className="absolute bottom-6 left-16 h-5 w-5 rounded-full border-[3px] border-coffee/45 bg-transparent" />
          <div className="absolute bottom-1 left-3 h-3 w-20 rounded-full bg-coffee/18 blur-[1px]" />
          <div className="absolute left-10 top-0 flex gap-1 opacity-80">
            <span className="h-9 w-[2px] rounded-full bg-coffee/28" />
            <span className="mt-1 h-7 w-[2px] rounded-full bg-coffee/20" />
            <span className="mt-0.5 h-8 w-[2px] rounded-full bg-coffee/24" />
          </div>
        </div>
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  )
}
