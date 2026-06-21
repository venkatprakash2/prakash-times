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
        <svg viewBox="0 0 400 400" className="h-32 w-32 overflow-visible" role="img" aria-hidden="true">
          <defs>
            <linearGradient id="brassGradientOnly" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8a6f27" />
              <stop offset="25%" stopColor="#e8c86b" />
              <stop offset="50%" stopColor="#fff4cc" />
              <stop offset="75%" stopColor="#ccaa43" />
              <stop offset="100%" stopColor="#6e551c" />
            </linearGradient>
            <radialGradient id="foamGradientOnly" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#fff5e6" />
              <stop offset="60%" stopColor="#d1b48c" />
              <stop offset="100%" stopColor="#8c6239" />
            </radialGradient>
          </defs>

          <ellipse cx="200" cy="335" rx="80" ry="18" fill="rgba(0, 0, 0, 0.25)" />
          <path d="M 100,160 L 135,320 Q 200,340 265,320 L 300,160 Z" fill="url(#brassGradientOnly)" stroke="#5c4a1a" strokeWidth="1.5" />
          <path d="M 90,160 C 90,130 310,130 310,160 C 310,175 90,175 90,160 Z" fill="url(#brassGradientOnly)" stroke="#8a6f27" strokeWidth="1" />

          <ellipse cx="200" cy="160" rx="96" ry="32" fill="url(#foamGradientOnly)" />

          <g fill="#fff" opacity="0.6">
            <circle cx="150" cy="155" r="4" />
            <circle cx="158" cy="162" r="2" />
            <circle cx="230" cy="150" r="5" />
            <circle cx="242" cy="156" r="3" />
            <circle cx="190" cy="170" r="4" />
            <circle cx="210" cy="165" r="2.5" />
            <circle cx="175" cy="148" r="3.5" />
            <circle cx="222" cy="172" r="3" />
          </g>
          <g fill="#614124" opacity="0.4">
            <circle cx="146" cy="158" r="3" />
            <circle cx="236" cy="146" r="4" />
            <circle cx="185" cy="164" r="5" />
            <circle cx="202" cy="152" r="3" />
            <circle cx="250" cy="162" r="2" />
          </g>
        </svg>
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  )
}
