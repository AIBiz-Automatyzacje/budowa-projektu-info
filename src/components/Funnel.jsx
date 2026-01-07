import { Database, Filter, Sparkles, Fingerprint, Trophy, Facebook, MessageCircle, Brain, Layers } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState, useMemo } from 'react'

const funnelSteps = [
  { key: 'problems', value: 4003, label: 'Problemy źródłowe', icon: Database, color: 'from-slate-700 to-slate-600' },
  { key: 'filtered', value: 1026, label: 'Zwalidowane', icon: Filter, color: 'from-slate-600 to-teal-700' },
  { key: 'opportunities', value: 417, label: 'Okazje z 4 modeli AI', icon: Sparkles, color: 'from-teal-700 to-teal-600' },
  { key: 'unique', value: 358, label: 'Unikalne pomysły', icon: Fingerprint, color: 'from-teal-600 to-teal-500' },
  { key: 'top', value: 20, label: 'TOP 20', icon: Trophy, color: 'from-teal-500 to-orange-500' },
]

const sources = [
  { icon: Facebook, label: '105 grup FB', color: 'text-sky-400' },
  { icon: MessageCircle, label: '154 subredditów', color: 'text-orange-400' },
]

const aiModels = [
  'Opus 4.5',
  'Gemini 3.0 Pro',
  'Grok 4',
  'GPT 5.2',
]

const frameworks = [
  'Pain Radar',
  'Gap Hunter',
  'Product Finder',
]

// Particle component for funnel animation
function FunnelParticles({ isInView }) {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 100 + Math.random() * 250,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 3,
      size: 2 + Math.random() * 4,
    })), []
  )

  if (!isInView) return null

  return (
    <g className="particles">
      {particles.map((particle) => (
        <motion.circle
          key={particle.id}
          cx={particle.x}
          cy={0}
          r={particle.size}
          fill="url(#particleGrad)"
          initial={{ cy: -20, opacity: 0 }}
          animate={{
            cy: [0, 500],
            opacity: [0, 0.8, 0.8, 0],
            cx: [particle.x, 225 + (particle.x - 225) * 0.1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </g>
  )
}

// Animowany licznik
function AnimatedNumber({ value, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now() + delay * 1000
    const duration = 1500

    const animate = () => {
      const now = Date.now()
      if (now < startTime) {
        requestAnimationFrame(animate)
        return
      }

      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(eased * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, delay, isInView])

  return <span ref={ref} className="font-mono">{displayValue.toLocaleString()}</span>
}

export default function Funnel({ data }) {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-50px" })

  return (
    <div className="max-w-4xl mx-auto" ref={containerRef}>
      {/* Funnel with labels */}
      <div className="flex items-start justify-center gap-6">
        {/* Labels on the left */}
        <div className="relative w-56 h-[480px]">
          {funnelSteps.map((step, i) => {
            const topOffset = i * 90 + 15 + 37.5
            const Icon = step.icon
            return (
              <motion.div
                key={step.key}
                className="absolute right-0 flex items-center gap-3"
                style={{ top: `${topOffset}px`, transform: 'translateY(-50%)' }}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: i * 0.15,
                  ease: "easeOut"
                }}
              >
                <span className="text-lg font-display font-medium text-slate-300 whitespace-nowrap">{step.label}</span>
                <motion.div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    i === funnelSteps.length - 1
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                      : 'bg-gradient-to-br from-teal-500 to-cyan-500'
                  }`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.15 + 0.2,
                    type: "spring",
                    stiffness: 300
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon size={16} className="text-slate-900" />
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* SVG Funnel Shape */}
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
              <stop offset="100%" stopColor="#FF6B00" />
            </linearGradient>
            {/* Particle gradient */}
            <radialGradient id="particleGrad">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="1" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
            </radialGradient>
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Particles */}
          <FunnelParticles isInView={isInView} />

          {/* Funnel segments */}
          {funnelSteps.map((step, i) => {
            const y = i * 90 + 15
            const topWidth = 420 - i * 75
            const bottomWidth = 420 - (i + 1) * 75
            const topX = (450 - topWidth) / 2
            const bottomX = (450 - bottomWidth) / 2
            const height = 75
            const centerX = 225

            return (
              <motion.g
                key={step.key}
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {/* Trapezoid shape with glow */}
                <motion.path
                  d={`M ${topX} ${y}
                      L ${topX + topWidth} ${y}
                      L ${bottomX + bottomWidth} ${y + height}
                      L ${bottomX} ${y + height} Z`}
                  fill={`url(#funnelGrad${i + 1})`}
                  filter={i === funnelSteps.length - 1 ? "url(#glow)" : undefined}
                  className="drop-shadow-lg"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                />
                {/* Highlight edge */}
                <motion.line
                  x1={topX}
                  y1={y}
                  x2={topX + topWidth}
                  y2={y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.15 + 0.3 }}
                />
                {/* Number */}
                <text
                  x={centerX}
                  y={y + 48}
                  fill="white"
                  fontSize={i === funnelSteps.length - 1 ? "38" : "32"}
                  fontWeight="700"
                  textAnchor="middle"
                  className="select-none"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {step.value.toLocaleString()}
                </text>
              </motion.g>
            )
          })}
        </svg>
      </div>

      {/* Info cards below funnel */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {/* Sources card */}
        <motion.div
          className="glass-card rounded-2xl p-5"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 text-slate-400 mb-4">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <Database size={16} className="text-teal-400" />
            </div>
            <span className="text-sm font-display font-semibold uppercase tracking-wider">Źródła danych</span>
          </div>
          <div className="flex flex-col gap-2">
            {sources.map((source, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-700/50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.9 + i * 0.1 }}
                whileHover={{ scale: 1.03, borderColor: 'rgba(20, 184, 166, 0.4)' }}
              >
                <source.icon size={18} className={source.color} />
                <span className="text-white font-medium text-sm">{source.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Models card */}
        <motion.div
          className="glass-card rounded-2xl p-5"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 text-slate-400 mb-4">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <Brain size={16} className="text-teal-400" />
            </div>
            <span className="text-sm font-display font-semibold uppercase tracking-wider">Modele AI</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiModels.map((model, i) => (
              <motion.span
                key={i}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-teal-500/15 text-teal-300 border border-teal-500/30"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.9 + i * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {model}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Frameworks card */}
        <motion.div
          className="glass-card rounded-2xl p-5"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 text-slate-400 mb-4">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <Layers size={16} className="text-orange-400" />
            </div>
            <span className="text-sm font-display font-semibold uppercase tracking-wider">Frameworki</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {frameworks.map((framework, i) => (
              <motion.span
                key={i}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-500/15 text-orange-300 border border-orange-500/30"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.95 + i * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {framework}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
