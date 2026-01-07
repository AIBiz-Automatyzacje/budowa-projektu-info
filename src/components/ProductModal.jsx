import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Target, DollarSign, Cpu, Users, BarChart2, Sparkles } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

const radarLabels = {
  problem_clarity: 'Jasność',
  mvp_simplicity: 'Prostota',
  ai_leverage: 'AI',
  mobile_fit: 'Mobile',
  monetization: '$$$',
  competition_gap: 'Luka',
}

const patternColors = {
  AI_GENERATOR: { primary: '#14b8a6', secondary: '#06b6d4' },
  SIMPLIFIER: { primary: '#10b981', secondary: '#22c55e' },
  AI_ASSISTANT: { primary: '#0ea5e9', secondary: '#3b82f6' },
  AGGREGATOR: { primary: '#f59e0b', secondary: '#f97316' },
  MONITOR_ALERT: { primary: '#f43f5e', secondary: '#ec4899' },
  TEMPLATE_PACK: { primary: '#8b5cf6', secondary: '#a855f7' },
}

function getPatternColor(pattern) {
  if (!pattern) return patternColors.AI_ASSISTANT
  const mainPattern = Array.isArray(pattern) ? pattern[0] : pattern.split(',')[0].trim()
  return patternColors[mainPattern] || patternColors.AI_ASSISTANT
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 30,
    transition: { duration: 0.2 }
  }
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function ProductModal({ product, onClose }) {
  if (!product) return null

  const scores = product.scores_breakdown || {}
  const colors = getPatternColor(product.pattern)

  const radarData = Object.entries(scores)
    .filter(([_, value]) => value != null)
    .map(([key, value]) => ({
      subject: radarLabels[key] || key,
      value: value,
      fullMark: 100,
    }))

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Modal container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-4xl glass-card rounded-3xl shadow-2xl overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <motion.div
                className="relative p-6 md:p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800/50"
                variants={contentVariants}
              >
                <motion.button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>

                <div className="flex flex-col md:flex-row gap-6 md:items-start">
                  {/* Rank Box */}
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  >
                    <div
                      className="w-16 h-16 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white"
                      style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider opacity-80">Rank</span>
                      <span className="text-3xl font-bold leading-none">#{product.rank}</span>
                    </div>
                  </motion.div>

                  <div className="flex-1 space-y-2">
                    <motion.div
                      className="flex flex-wrap items-center gap-3"
                      variants={contentVariants}
                    >
                      {product.classification && (
                        <motion.span
                          className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border"
                          style={{
                            backgroundColor: `${colors.primary}20`,
                            borderColor: `${colors.primary}40`,
                            color: colors.primary
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {product.classification}
                        </motion.span>
                      )}
                      <span className="text-slate-500 text-sm font-medium">
                        {product.gap_type?.replace(/_/g, ' ')}
                      </span>
                    </motion.div>

                    <motion.h2
                      className="text-2xl md:text-3xl font-display font-bold text-white leading-tight"
                      variants={contentVariants}
                    >
                      {product.name}
                    </motion.h2>

                    <motion.p
                      className="text-lg text-slate-300 leading-relaxed max-w-2xl"
                      variants={contentVariants}
                    >
                      {product.tagline}
                    </motion.p>
                  </div>

                  {/* Score Big Display */}
                  <motion.div
                    className="hidden md:flex flex-col items-end mt-8"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div
                      className="text-4xl font-bold tabular-nums"
                      style={{ color: colors.primary }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                    >
                      {product.unified_score}
                    </motion.div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Ocena Końcowa</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Main Content Grid */}
              <div className="grid md:grid-cols-12 min-h-[450px]">
                {/* Left Column: Radar Chart */}
                <motion.div
                  className="md:col-span-5 p-6 border-r border-slate-800 bg-slate-900/50"
                  variants={contentVariants}
                >
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BarChart2 size={16} />
                    Profil Okazji
                  </h3>

                  {radarData.length > 0 ? (
                    <motion.div
                      className="h-[280px] w-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid stroke="#334155" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                          />
                          <Radar
                            name="Score"
                            dataKey="value"
                            stroke={colors.primary}
                            strokeWidth={2}
                            fill={colors.primary}
                            fillOpacity={0.25}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderColor: '#1e293b',
                              borderRadius: '8px',
                              color: '#f1f5f9'
                            }}
                            itemStyle={{ color: colors.primary }}
                            formatter={(value) => [`${value}/100`, 'Score']}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-slate-500">
                      Brak danych scoringowych
                    </div>
                  )}

                  {/* Quick Stats Grid */}
                  <motion.div
                    className={`grid ${product.displacement_potential ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mt-4`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {product.displacement_potential && (
                      <motion.div
                        className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                        whileHover={{ scale: 1.02, borderColor: colors.primary + '40' }}
                      >
                        <div className="text-xs text-slate-500 mb-1">Potencjał</div>
                        <div className="font-semibold" style={{ color: colors.primary }}>
                          {product.displacement_potential}
                        </div>
                      </motion.div>
                    )}
                    <motion.div
                      className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                      whileHover={{ scale: 1.02, borderColor: colors.primary + '40' }}
                    >
                      <div className="text-xs text-slate-500 mb-1">Konsensus</div>
                      <div className="font-semibold text-white">
                        {product.model_count ? `${product.model_count}/4 modeli` : 'N/A'}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Right Column: Details */}
                <motion.div
                  className="md:col-span-7 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[500px]"
                  variants={contentVariants}
                >
                  {/* Problem Section */}
                  {product.problem_quote && (
                    <motion.section
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Zidentyfikowany Problem
                      </h3>
                      <motion.div
                        className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 italic text-slate-300 leading-relaxed"
                        whileHover={{ scale: 1.01, borderColor: 'rgba(245, 158, 11, 0.4)' }}
                      >
                        "{product.problem_quote}"
                      </motion.div>
                    </motion.section>
                  )}

                  {/* Tech & Monetization */}
                  <motion.div
                    className="grid sm:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {product.tech_stack && (
                      <motion.section
                        className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50"
                        whileHover={{ scale: 1.02, borderColor: 'rgba(14, 165, 233, 0.3)' }}
                      >
                        <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Cpu size={16} />
                          Tech Stack
                        </h3>
                        <p className="text-sm text-slate-300">{product.tech_stack}</p>
                      </motion.section>
                    )}
                    {product.monetization_model && (
                      <motion.section
                        className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50"
                        whileHover={{ scale: 1.02, borderColor: 'rgba(16, 185, 129, 0.3)' }}
                      >
                        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <DollarSign size={16} />
                          Monetyzacja
                        </h3>
                        <p className="text-sm text-slate-300">{product.monetization_model}</p>
                      </motion.section>
                    )}
                  </motion.div>

                  {/* Target Personas */}
                  {product.target_personas?.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Users size={16} />
                        Target Persona
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.target_personas.map((persona, i) => (
                          <motion.span
                            key={i}
                            className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 text-sm border border-slate-700"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            whileHover={{ scale: 1.05, borderColor: colors.primary + '40' }}
                          >
                            {persona}
                          </motion.span>
                        ))}
                      </div>
                    </motion.section>
                  )}

                  {/* Competitors */}
                  {product.competitors?.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Target size={16} />
                        Konkurenci
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.competitors.slice(0, 6).map((comp, i) => (
                          <motion.span
                            key={i}
                            className="px-3 py-1 rounded-md bg-rose-500/10 text-rose-300 text-xs border border-rose-500/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + i * 0.05 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {comp}
                          </motion.span>
                        ))}
                      </div>
                    </motion.section>
                  )}
                </motion.div>
              </div>

              {/* Footer */}
              <motion.div
                className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles size={14} />
                  </motion.div>
                  <span>Source: {product.source || 'Multi-model analysis'}</span>
                </div>
                {product.classification && (
                  <span
                    className="text-xs font-medium px-2 py-1 rounded"
                    style={{ color: colors.primary }}
                  >
                    {product.classification}
                  </span>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
