import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import IntroReveal from '../animations/IntroReveal'

export default function Shell({ children }) {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="min-h-screen text-ink">
      <IntroReveal />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
