import { TrendingUp } from 'lucide-react'

const patternColors = {
  AI_GENERATOR: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  SIMPLIFIER: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  AI_ASSISTANT: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  AGGREGATOR: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  MONITOR_ALERT: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  TEMPLATE_PACK: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

const patternLabels = {
  AI_GENERATOR: 'Generator',
  SIMPLIFIER: 'Simplifier',
  AI_ASSISTANT: 'Asystent',
  AGGREGATOR: 'Agregator',
  MONITOR_ALERT: 'Monitor',
  TEMPLATE_PACK: 'Szablony',
}

function getMainPattern(pattern) {
  if (!pattern) return null
  // Handle array or string
  if (Array.isArray(pattern)) return pattern[0]
  if (typeof pattern === 'string') return pattern.split(',')[0].trim()
  return null
}

export default function ProductCard({ product, onClick }) {
  const mainPattern = getMainPattern(product.pattern)
  const patternColor = mainPattern ? patternColors[mainPattern] : patternColors.AI_ASSISTANT
  const patternLabel = mainPattern ? patternLabels[mainPattern] : 'Inne'

  // Score color based on value
  const scoreColor = product.unified_score >= 95
    ? 'text-teal-400'
    : product.unified_score >= 90
    ? 'text-cyan-400'
    : 'text-amber-400'

  return (
    <button
      onClick={onClick}
      className="group relative p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all duration-200 text-left w-full hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
    >
      {/* Rank badge */}
      <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-sm font-bold">
        {product.rank}
      </div>

      {/* Content */}
      <div className="pt-2">
        {/* Pattern badge */}
        <div className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${patternColor} mb-2`}>
          {patternLabel}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* Tagline */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {product.tagline}
        </p>

        {/* Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <TrendingUp size={14} className={scoreColor} />
            <span className={`text-lg font-bold ${scoreColor}`}>
              {product.unified_score}
            </span>
          </div>

          {/* Model count badge */}
          {product.model_count && (
            <div className="text-xs text-gray-500">
              {product.model_count}/4 modeli
            </div>
          )}
        </div>

        {/* Score bar */}
        <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-600 via-cyan-500 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${product.unified_score}%` }}
          />
        </div>
      </div>
    </button>
  )
}
