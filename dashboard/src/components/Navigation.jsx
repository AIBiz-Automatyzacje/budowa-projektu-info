import { NavLink } from 'react-router-dom'
import { BarChart3, Database, Brain } from 'lucide-react'

const navItems = [
  { path: '/', label: 'TOP 20', icon: BarChart3 },
  { path: '/faza-1', label: 'Faza 1: Dane', icon: Database },
  { path: '/faza-2', label: 'Faza 2: Analiza', icon: Brain },
]

export default function Navigation() {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center">
              <span className="text-xl font-bold text-slate-900">20</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg">Okazje Produktowe</h1>
              <p className="text-xs text-gray-500">4003 problemów → TOP 20</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-400'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
