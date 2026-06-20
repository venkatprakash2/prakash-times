import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { routes } from '../../routes/routes'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ink/20 bg-paper/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <NavLink to="/" className="font-display text-xl font-bold tracking-wide" onClick={() => setOpen(false)}>
          The Prakash Times
        </NavLink>
        <button
          className="grid size-10 place-items-center border border-ink/25 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className="hidden items-center gap-1 lg:flex">
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  isActive ? 'bg-ink text-newsprint' : 'text-ink/72 hover:bg-ink/10 hover:text-ink'
                }`
              }
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-ink/15 bg-newsprint px-4 py-4 lg:hidden">
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                  isActive ? 'bg-ink text-newsprint' : 'text-ink/72'
                }`
              }
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
