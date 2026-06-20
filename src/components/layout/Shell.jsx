import Navbar from './Navbar'
import Footer from './Footer'
import IntroReveal from '../animations/IntroReveal'

export default function Shell({ children }) {
  return (
    <div className="min-h-screen text-ink">
      <IntroReveal />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
