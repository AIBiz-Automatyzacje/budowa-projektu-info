import { Database, Filter, Sparkles, Fingerprint, Trophy, Facebook, MessageCircle, Brain, Layers } from 'lucide-react'

const funnelSteps = [
  { key: 'problems', value: 4003, label: 'Problemy źródłowe', icon: Database, color: 'from-slate-700 to-slate-600' },
  { key: 'filtered', value: 1026, label: 'Zwalidowane', icon: Filter, color: 'from-slate-600 to-teal-700' },
  { key: 'opportunities', value: 417, label: 'Okazje z 4 modeli AI', icon: Sparkles, color: 'from-teal-700 to-teal-600' },
  { key: 'unique', value: 358, label: 'Unikalne pomysły', icon: Fingerprint, color: 'from-teal-600 to-teal-500' },
  { key: 'top', value: 20, label: 'TOP 20', icon: Trophy, color: 'from-teal-500 to-amber-500' },
]

// Źródła danych
const sources = [
  { icon: Facebook, label: '105 grup FB', color: 'text-sky-400' },
  { icon: MessageCircle, label: '154 subredditów', color: 'text-amber-400' },
]

// Modele i frameworki
const techStack = [
  { label: 'GPT-4o', type: 'model' },
  { label: 'Claude 3.5', type: 'model' },
  { label: 'Gemini 1.5', type: 'model' },
  { label: 'DeepSeek', type: 'model' },
  { label: 'Pain Radar', type: 'framework' },
  { label: 'Gap Hunter', type: 'framework' },
]

export default function Funnel({ data }) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Funnel with labels */}
      <div className="flex items-start justify-center gap-6">
        {/* Labels on the left - positioned to match funnel segments */}
        <div className="relative w-56 h-[480px]">
          {funnelSteps.map((step, i) => {
            // Match SVG positioning: y = i * 90 + 15, height = 75, so center = y + 37.5
            const topOffset = i * 90 + 15 + 37.5 // center of each segment
            return (
              <div
                key={step.key}
                className="absolute right-0 flex items-center gap-3 funnel-animate"
                style={{
                  top: `${topOffset}px`,
                  transform: 'translateY(-50%)',
                  animationDelay: `${i * 100}ms`
                }}
              >
                <span className="text-lg font-medium text-slate-300 whitespace-nowrap">{step.label}</span>
                <div className={`w-3 h-3 rounded-full ${
                  i === funnelSteps.length - 1 ? 'bg-amber-500' : 'bg-teal-500'
                }`} />
              </div>
            )
          })}
        </div>

        {/* SVG Funnel Shape - only numbers */}
        <svg viewBox="0 0 450 480" className="w-[450px] flex-shrink-0" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="funnelGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="funnelGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id="funnelGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="funnelGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <linearGradient id="funnelGrad5" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Funnel segments - trapezoids */}
          {funnelSteps.map((step, i) => {
            const y = i * 90 + 15
            const topWidth = 420 - i * 75
            const bottomWidth = 420 - (i + 1) * 75
            const topX = (450 - topWidth) / 2
            const bottomX = (450 - bottomWidth) / 2
            const height = 75
            const centerX = 225

            return (
              <g key={step.key} className="funnel-animate" style={{ animationDelay: `${i * 100}ms` }}>
                {/* Trapezoid shape */}
                <path
                  d={`M ${topX} ${y}
                      L ${topX + topWidth} ${y}
                      L ${bottomX + bottomWidth} ${y + height}
                      L ${bottomX} ${y + height} Z`}
                  fill={`url(#funnelGrad${i + 1})`}
                  className="drop-shadow-lg"
                />
                {/* Only number centered */}
                <text
                  x={centerX}
                  y={y + 48}
                  fill="white"
                  fontSize={i === funnelSteps.length - 1 ? "38" : "32"}
                  fontWeight="700"
                  textAnchor="middle"
                  className="select-none"
                >
                  {step.value.toLocaleString()}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Info cards below funnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {/* Sources card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <Database size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">Źródła danych</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {sources.map((source, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                <source.icon size={18} className={source.color} />
                <span className="text-white font-medium">{source.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <Brain size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">Analiza AI</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  tech.type === 'model'
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {tech.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
