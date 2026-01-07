import { NavLink } from 'react-router-dom'
import { BarChart3, Database, Brain } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/', label: 'Dashboard', icon: BarChart3 },
  { path: '/faza-1', label: 'Faza 1: Dane', icon: Database },
  { path: '/faza-2', label: 'Faza 2: Analiza', icon: Brain },
]

export default function Navigation() {
  return (
    <motion.nav
      className="glass border-b border-slate-700/50 sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.img
              src="/logo.png"
              alt="Logo"
              className="w-11 h-11 rounded-xl shadow-lg shadow-orange-500/40 object-cover"
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
            <h1 className="font-display font-semibold text-2xl text-white tracking-tight">
              ProjektOdZera
            </h1>
          </motion.div>

          {/* Nav Links */}
          <div className="flex gap-2">
            {navItems.map(({ path, label, icon: Icon }, index) => (
              <NavLink
                key={path}
                to={path}
                className="group"
              >
                {({ isActive }) => (
                  <motion.div
                    className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-300 border border-orange-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={18} className={isActive ? 'text-orange-400' : 'group-hover:text-orange-400 transition-colors'} />
                    <span className="hidden sm:inline font-medium text-sm">{label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
                        layoutId="nav-indicator"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
