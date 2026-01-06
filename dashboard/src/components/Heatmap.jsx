import { useState } from 'react'

const metrics = [
  { key: 'problem_clarity', label: 'Problem Clarity' },
  { key: 'mvp_simplicity', label: 'MVP Simplicity' },
  { key: 'ai_leverage', label: 'AI Leverage' },
  { key: 'mobile_fit', label: 'Mobile Fit' },
  { key: 'monetization', label: 'Monetyzacja' },
  { key: 'competition_gap', label: 'Competition Gap' },
  { key: 'white_space', label: 'White Space' },
  { key: 'community_fit', label: 'Community Fit' },
]

function getHeatColor(value) {
  if (value == null) return 'bg-slate-800/50'
  if (value >= 80) return 'bg-teal-500/80'
  if (value >= 60) return 'bg-teal-600/60'
  if (value >= 40) return 'bg-cyan-600/60'
  if (value >= 20) return 'bg-amber-500/60'
  return 'bg-rose-500/60'
}

export default function Heatmap({ products }) {
  const [hoveredCell, setHoveredCell] = useState(null)

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header row - product names */}
        <div className="flex mb-2">
          <div className="w-32 flex-shrink-0" /> {/* Empty corner */}
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-1 text-center text-xs text-gray-500 px-1 truncate"
              title={product.name}
            >
              #{product.rank}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {metrics.map((metric) => (
          <div key={metric.key} className="flex mb-1">
            {/* Row label */}
            <div className="w-32 flex-shrink-0 text-xs text-gray-400 flex items-center pr-2">
              {metric.label}
            </div>

            {/* Cells */}
            {products.map((product) => {
              const value = product.scores_breakdown?.[metric.key]
              const isHovered = hoveredCell?.product === product.id && hoveredCell?.metric === metric.key

              return (
                <div
                  key={`${product.id}-${metric.key}`}
                  className={`flex-1 h-8 mx-0.5 rounded ${getHeatColor(value)} transition-all cursor-pointer ${
                    isHovered ? 'ring-2 ring-white scale-105 z-10' : ''
                  }`}
                  onMouseEnter={() => setHoveredCell({ product: product.id, metric: metric.key, value, name: product.name })}
                  onMouseLeave={() => setHoveredCell(null)}
                />
              )
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-rose-500/60" />
            <span>0-20</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500/60" />
            <span>20-40</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-cyan-600/60" />
            <span>40-60</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-teal-600/60" />
            <span>60-80</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-teal-500/80" />
            <span>80-100</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-800/50" />
            <span>N/A</span>
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-sm z-50">
            <span className="text-white font-medium">{hoveredCell.name}</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-400">{metrics.find(m => m.key === hoveredCell.metric)?.label}</span>
            <span className="text-gray-400 mx-2">:</span>
            <span className="text-white font-bold">
              {hoveredCell.value != null ? hoveredCell.value : 'N/A'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
