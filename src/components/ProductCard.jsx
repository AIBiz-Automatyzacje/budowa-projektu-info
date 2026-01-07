import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight, Crown, Zap, Star } from 'lucide-react'

const patternColors = {
  AI_GENERATOR: {
    badge: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
    accent: 'from-teal-500 to-orange-500',
    glow: 'group-hover:shadow-orange-500/20',
  },
  SIMPLIFIER: {
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    accent: 'from-emerald-500 to-green-500',
    glow: 'group-hover:shadow-emerald-500/20',
  },
  AI_ASSISTANT: {
    badge: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    accent: 'from-sky-500 to-orange-400',
    glow: 'group-hover:shadow-orange-500/20',
  },
  AGGREGATOR: {
    badge: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
    accent: 'from-orange-500 to-orange-400',
    glow: 'group-hover:shadow-orange-500/20',
  },
  MONITOR_ALERT: {
    badge: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    accent: 'from-rose-500 to-pink-500',
    glow: 'group-hover:shadow-rose-500/20',
  },
  TEMPLATE_PACK: {
    badge: 'bg-violet-500/20 text-violet-300 border-violet-400/40',
    accent: 'from-violet-500 to-purple-500',
    glow: 'group-hover:shadow-violet-500/20',
  },
}

const patternLabels = {
  AI_GENERATOR: 'Generator',
  SIMPLIFIER: 'Simplifier',
  AI_ASSISTANT: 'Asystent',
  AGGREGATOR: 'Agregator',
  MONITOR_ALERT: 'Monitor',
  TEMPLATE_PACK: 'Szablony',
}

export const patternDescriptions = {
  AI_GENERATOR: 'Tworzy nowe treści (tekst, grafika, wideo) za pomocą AI',
  SIMPLIFIER: 'Upraszcza złożone procesy do kilku kliknięć',
  AI_ASSISTANT: 'Inteligentny asystent wspierający w codziennych zadaniach',
  AGGREGATOR: 'Zbiera dane z wielu źródeł w jednym miejscu',
  MONITOR_ALERT: 'Monitoruje i powiadamia o ważnych zmianach',
  TEMPLATE_PACK: 'Gotowe szablony i checklisty do natychmiastowego użycia',
}

function getMainPattern(pattern) {
  if (!pattern) return null
  if (Array.isArray(pattern)) return pattern[0]
  if (typeof pattern === 'string') return pattern.split(',')[0].trim()
  return null
}

const heroIcons = [Crown, Zap, Star]

export default function ProductCard({ product, onClick, index = 0, isHero = false }) {
  const mainPattern = getMainPattern(product.pattern)
  const patternStyle = mainPattern ? patternColors[mainPattern] : patternColors.AI_ASSISTANT
  const patternLabel = mainPattern ? patternLabels[mainPattern] : 'Inne'
  const HeroIcon = heroIcons[product.rank - 1] || Star

  const scoreColor = product.unified_score >= 95
    ? 'text-[#FF6B00]'
    : product.unified_score >= 90
    ? 'text-teal-400'
    : 'text-orange-400'

  // Hero card styling
  if (isHero) {
    return (
      <motion.button
        onClick={onClick}
        className="group relative glass-card rounded-3xl text-left w-full h-full overflow-visible flex flex-col"
        whileHover={{
          scale: 1.02,
          y: -8,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Hero glow effect */}
        <motion.div
          className={`absolute -inset-1 bg-gradient-to-br ${patternStyle.accent} opacity-0 rounded-3xl blur-2xl`}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.25 }}
          transition={{ duration: 0.4 }}
        />

        {/* Animated border gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${patternStyle.accent} rounded-3xl opacity-20`}
          animate={{
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Inner content wrapper */}
        <div className="relative p-6 pt-8 flex flex-col h-full bg-slate-900/90 rounded-3xl m-[1px]">
          {/* Accent gradient line at top */}
          <div className={`absolute top-0 left-6 right-6 h-1 bg-gradient-to-r ${patternStyle.accent} rounded-full`} />

          {/* Rank badge - larger for hero */}
          <motion.div
            className={`absolute -top-4 -left-4 w-14 h-14 rounded-2xl bg-gradient-to-br ${patternStyle.accent} shadow-xl flex flex-col items-center justify-center text-white`}
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <HeroIcon size={16} className="mb-0.5" />
            <span className="text-lg font-display font-bold">#{product.rank}</span>
          </motion.div>

          {/* Content */}
          <div className="pt-4 relative z-10 flex-1 flex flex-col">
            {/* Pattern badge */}
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold border ${patternStyle.badge} mb-4 self-start`}
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${patternStyle.accent}`}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {patternLabel}
            </motion.div>

            {/* Name */}
            <h3 className="font-display font-bold text-white text-2xl group-hover:text-teal-300 transition-colors leading-tight mb-3">
              {product.name}
            </h3>

            {/* Tagline */}
            <p className="text-base text-slate-300 leading-relaxed mb-6 flex-1">
              {product.tagline}
            </p>

            {/* Score section - enhanced for hero */}
            <div className="flex items-end justify-between mb-4">
              <div className="flex items-baseline gap-2">
                <motion.div
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                >
                  <TrendingUp size={20} className={scoreColor} />
                </motion.div>
                <span className={`text-4xl font-display font-bold ${scoreColor}`}>
                  {product.unified_score}
                </span>
                <span className="text-sm text-slate-500 uppercase tracking-wide font-mono">pkt</span>
              </div>

              {product.model_count && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 text-sm text-slate-400 border border-slate-700/50">
                  <span className="font-mono font-semibold text-white">{product.model_count}</span>/4 modeli
                </div>
              )}
            </div>

            {/* Score bar - thicker for hero */}
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-5">
              <motion.div
                className={`h-full bg-gradient-to-r ${patternStyle.accent} rounded-full`}
                initial={{ width: 0 }}
                whileInView={{ width: `${product.unified_score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
              />
            </div>

            {/* CTA */}
            <motion.div
              className="flex items-center justify-center gap-3 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Zobacz szczegóły</span>
              <ArrowRight size={18} />
            </motion.div>
          </div>
        </div>
      </motion.button>
    )
  }

  // Standard card
  return (
    <motion.button
      onClick={onClick}
      className="group relative p-5 pt-6 rounded-2xl glass-card text-left w-full h-full overflow-visible flex flex-col"
      whileHover={{
        scale: 1.03,
        y: -4,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Animated glow effect on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${patternStyle.accent} opacity-0 rounded-2xl blur-xl`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Accent gradient line at top */}
      <motion.div
        className={`absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r ${patternStyle.accent} rounded-full`}
        initial={{ scaleX: 0.6, opacity: 0.6 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Rank badge */}
      <motion.div
        className={`absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-gradient-to-br ${patternStyle.accent} shadow-lg flex items-center justify-center text-sm font-display font-bold text-white`}
        whileHover={{ scale: 1.1, rotate: -5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        #{product.rank}
      </motion.div>

      {/* Content */}
      <div className="pt-3 relative z-10 flex-1 flex flex-col">
        {/* Pattern badge */}
        <motion.div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${patternStyle.badge} mb-3 self-start`}
          whileHover={{ scale: 1.05 }}
        >
          <motion.span
            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${patternStyle.accent}`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          {patternLabel}
        </motion.div>

        {/* Name */}
        <h3 className="font-display font-bold text-white text-lg group-hover:text-teal-300 transition-colors leading-tight mb-2">
          {product.name}
        </h3>

        {/* Tagline */}
        <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
          {product.tagline}
        </p>

        {/* Score section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <TrendingUp size={16} className={scoreColor} />
            </motion.div>
            <span className={`text-2xl font-display font-bold ${scoreColor}`}>
              {product.unified_score}
            </span>
            <span className="text-xs text-slate-500 uppercase tracking-wide font-mono">pkt</span>
          </div>

          {product.model_count && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/80 text-xs text-slate-400">
              <span className="font-mono font-semibold text-white">{product.model_count}</span>/4
            </div>
          )}
        </div>

        {/* Score bar */}
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className={`h-full bg-gradient-to-r ${patternStyle.accent} rounded-full`}
            initial={{ width: 0 }}
            whileInView={{ width: `${product.unified_score}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.05, ease: "easeOut" }}
          />
        </div>

        {/* Hover action */}
        <motion.div
          className="flex items-center justify-center gap-2 py-2 rounded-lg text-slate-500 group-hover:text-teal-400 transition-colors"
        >
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Zobacz szczegóły
          </span>
          <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>
    </motion.button>
  )
}
