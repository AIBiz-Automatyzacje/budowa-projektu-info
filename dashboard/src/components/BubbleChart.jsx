import { useState, useMemo } from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const patternColors = {
  AI_GENERATOR: '#14B8A6',     // teal
  SIMPLIFIER: '#10B981',       // emerald
  AI_ASSISTANT: '#0EA5E9',     // sky
  AGGREGATOR: '#F59E0B',       // amber
  MONITOR_ALERT: '#F43F5E',    // rose
  TEMPLATE_PACK: '#64748B',    // slate
}

const patternLabels = {
  AI_GENERATOR: 'AI Generator',
  SIMPLIFIER: 'Simplifier',
  AI_ASSISTANT: 'AI Assistant',
  AGGREGATOR: 'Agregator',
  MONITOR_ALERT: 'Monitor/Alert',
  TEMPLATE_PACK: 'Template Pack',
}

function getMainPattern(pattern) {
  if (!pattern) return 'AI_ASSISTANT'
  // Handle array or string
  if (Array.isArray(pattern)) return pattern[0]
  if (typeof pattern === 'string') return pattern.split(',')[0].trim()
  return 'AI_ASSISTANT'
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const data = payload[0].payload

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
      <div className="font-semibold text-white mb-2">{data.name}</div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">MVP Simplicity:</span>
          <span className="text-white">{data.x}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">AI Leverage:</span>
          <span className="text-white">{data.y}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Score:</span>
          <span className="text-white font-bold">{data.score}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Pattern:</span>
          <span className="text-white">{patternLabels[data.pattern] || 'Inne'}</span>
        </div>
      </div>
    </div>
  )
}

export default function BubbleChart({ products, onSelect }) {
  const [activePattern, setActivePattern] = useState(null)

  const chartData = useMemo(() => {
    return products.map((p) => {
      const pattern = getMainPattern(p.pattern)
      return {
        id: p.id,
        name: p.name,
        x: p.scores_breakdown?.mvp_simplicity || 50,
        y: p.scores_breakdown?.ai_leverage || 50,
        z: p.unified_score,
        score: p.unified_score,
        pattern,
        product: p,
      }
    })
  }, [products])

  const filteredData = activePattern
    ? chartData.filter((d) => d.pattern === activePattern)
    : chartData

  // Get unique patterns for legend
  const uniquePatterns = [...new Set(chartData.map((d) => d.pattern))]

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          onClick={() => setActivePattern(null)}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            activePattern === null
              ? 'bg-white text-gray-900'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Wszystkie
        </button>
        {uniquePatterns.map((pattern) => (
          <button
            key={pattern}
            onClick={() => setActivePattern(activePattern === pattern ? null : pattern)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-2 ${
              activePattern === pattern
                ? 'bg-white text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: patternColors[pattern] }}
            />
            {patternLabels[pattern] || pattern}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[400px] bg-gray-900/50 rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 100]}
              name="MVP Simplicity"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#374151' }}
              tickLine={{ stroke: '#374151' }}
              label={{
                value: 'MVP Simplicity →',
                position: 'bottom',
                fill: '#9CA3AF',
                fontSize: 12,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 100]}
              name="AI Leverage"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#374151' }}
              tickLine={{ stroke: '#374151' }}
              label={{
                value: '↑ AI Leverage',
                angle: -90,
                position: 'left',
                fill: '#9CA3AF',
                fontSize: 12,
              }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              data={filteredData}
              onClick={(data) => onSelect(data.product)}
              style={{ cursor: 'pointer' }}
            >
              {filteredData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={patternColors[entry.pattern] || '#6B7280'}
                  fillOpacity={0.8}
                  stroke={patternColors[entry.pattern] || '#6B7280'}
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Axis explanation */}
      <div className="flex justify-center gap-8 mt-4 text-xs text-gray-500">
        <span>Oś X: Jak łatwo zbudować MVP</span>
        <span>Oś Y: Jak mocno AI pomaga</span>
        <span>Rozmiar: Final Score</span>
      </div>
    </div>
  )
}
