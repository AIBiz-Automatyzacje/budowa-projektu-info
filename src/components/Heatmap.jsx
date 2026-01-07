import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Activity } from 'lucide-react'

const metrics = [
  { key: 'problem_clarity', label: 'Problem Clarity', icon: '🎯' },
  { key: 'mvp_simplicity', label: 'MVP Simplicity', icon: '⚡' },
  { key: 'ai_leverage', label: 'AI Leverage', icon: '🤖' },
  { key: 'mobile_fit', label: 'Mobile Fit', icon: '📱' },
  { key: 'monetization', label: 'Monetyzacja', icon: '💰' },
  { key: 'competition_gap', label: 'Competition Gap', icon: '🎪' },
]

function getHeatColor(value) {
  if (value == null) return { bg: 'bg-slate-800/30', text: 'text-slate-600', border: 'border-slate-700/30' }
  if (value >= 80) return { bg: 'bg-teal-500/30', text: 'text-teal-300', border: 'border-teal-500/40', pulse: true }
  if (value >= 60) return { bg: 'bg-teal-600/25', text: 'text-teal-400', border: 'border-teal-600/30' }
  if (value >= 40) return { bg: 'bg-cyan-600/25', text: 'text-cyan-400', border: 'border-cyan-600/30' }
  if (value >= 20) return { bg: 'bg-orange-500/25', text: 'text-orange-400', border: 'border-orange-500/30' }
  return { bg: 'bg-rose-500/25', text: 'text-rose-400', border: 'border-rose-500/30' }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.015
    }
  }
}

const cellVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, type: "spring", stiffness: 200 }
  }
}

export default function Heatmap({ products }) {
  const [hoveredCell, setHoveredCell] = useState(null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-50px" })

  return (
    <div className="glass-card rounded-2xl p-6" ref={containerRef}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
          <Activity size={20} className="text-slate-900" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-white">Mapa Wskaźników</h3>
          <p className="text-sm text-slate-400">Porównanie TOP 20 produktów</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header row - product ranks */}
          <motion.div
            className="flex mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            <div className="w-40 flex-shrink-0" />
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                className="flex-1 text-center px-0.5"
                initial={{ opacity: 0, y: -10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.02, duration: 0.3 }}
              >
                <div className={`text-xs font-mono font-bold ${
                  product.rank <= 3 ? 'text-orange-400' : 'text-slate-500'
                }`}>
                  #{product.rank}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Data rows */}
          <motion.div
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {metrics.map((metric, rowIndex) => (
              <motion.div
                key={metric.key}
                className="flex items-center"
                variants={rowVariants}
              >
                {/* Row label */}
                <motion.div
                  className="w-40 flex-shrink-0 flex items-center gap-2 pr-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: rowIndex * 0.08, duration: 0.3 }}
                >
                  <span className="text-lg">{metric.icon}</span>
                  <span className="text-sm text-slate-300 font-medium">{metric.label}</span>
                </motion.div>

                {/* Cells */}
                {products.map((product) => {
                  const value = product.scores_breakdown?.[metric.key]
                  const colors = getHeatColor(value)
                  const isHovered = hoveredCell?.product === product.id && hoveredCell?.metric === metric.key

                  return (
                    <motion.div
                      key={`${product.id}-${metric.key}`}
                      className={`flex-1 h-10 mx-0.5 rounded-lg ${colors.bg} border ${colors.border} cursor-pointer flex items-center justify-center relative overflow-hidden ${
                        isHovered ? 'ring-2 ring-white/50 z-10' : ''
                      } ${colors.pulse ? 'heat-cell-high' : ''}`}
                      variants={cellVariants}
                      whileHover={{
                        scale: 1.1,
                        zIndex: 20,
                        transition: { duration: 0.15 }
                      }}
                      onMouseEnter={() => setHoveredCell({
                        product: product.id,
                        metric: metric.key,
                        value,
                        name: product.name
                      })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span className={`text-xs font-mono font-bold ${colors.text}`}>
                        {value != null ? value : '—'}
                      </span>
                    </motion.div>
                  )
                })}
              </motion.div>
            ))}
          </motion.div>

          {/* Legend */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <span className="text-xs text-slate-500 mr-2">Skala:</span>
            {[
              { bg: 'bg-rose-500/30', border: 'border-rose-500/40', label: '0-20' },
              { bg: 'bg-orange-500/30', border: 'border-orange-500/40', label: '20-40' },
              { bg: 'bg-cyan-600/30', border: 'border-cyan-600/40', label: '40-60' },
              { bg: 'bg-teal-600/30', border: 'border-teal-600/40', label: '60-80' },
              { bg: 'bg-teal-500/40', border: 'border-teal-500/50', label: '80-100' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.9 + i * 0.05 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className={`w-6 h-6 rounded-md ${item.bg} border ${item.border}`} />
                <span className="text-xs text-slate-400 font-mono">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Tooltip */}
          {hoveredCell && (
            <motion.div
              className="fixed bottom-6 left-1/2 px-5 py-3 glass rounded-xl shadow-2xl text-sm z-50"
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 10 }}
            >
              <span className="text-white font-display font-semibold">{hoveredCell.name}</span>
              <span className="text-slate-500 mx-3">→</span>
              <span className="text-slate-400">{metrics.find(m => m.key === hoveredCell.metric)?.label}</span>
              <span className="text-slate-500 mx-3">:</span>
              <motion.span
                className="text-teal-400 font-mono font-bold text-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                key={hoveredCell.value}
              >
                {hoveredCell.value != null ? hoveredCell.value : 'N/A'}
              </motion.span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
