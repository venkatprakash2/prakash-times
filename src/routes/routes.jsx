import Home from '../pages/Home'
import Memories from '../pages/Memories'
import Leadership from '../pages/Leadership'
import CurrentAffairs from '../pages/CurrentAffairs'
import Movies from '../pages/Movies'
import AiTechnology from '../pages/AiTechnology'
import Chess from '../pages/Chess'
import Birthdays from '../pages/Birthdays'

export const routes = [
  { path: '/', label: 'Home', element: <Home /> },
  { path: '/memories', label: 'Memories', element: <Memories /> },
  { path: '/leadership', label: 'Leadership', element: <Leadership /> },
  { path: '/current-affairs', label: 'Current Affairs', element: <CurrentAffairs /> },
  { path: '/movies', label: 'Movies', element: <Movies /> },
  { path: '/ai-technology', label: 'AI & Tech', element: <AiTechnology /> },
  { path: '/chess', label: 'Chess', element: <Chess /> },
  { path: '/birthdays', label: 'Birthdays', element: <Birthdays /> },
]
