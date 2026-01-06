import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { X, ExternalLink, Zap, Target, DollarSign, Cpu, Users, AlertTriangle } from 'lucide-react'

const scoreLabels = {
  problem_clarity: 'Jasność problemu',
  mvp_simplicity: 'Prostota MVP',
  ai_leverage: 'AI Leverage',
  mobile_fit: 'Mobile Fit',
  monetization: 'Monetyzacja',
  competition_gap: 'Luka konkurencyjna',
  white_space: 'White Space',
  community_fit: 'Community Fit',
}

function ScoreBar({ label, value }) {
  if (value == null) return null

  const color = value >= 80 ? 'bg-teal-500' : value >= 50 ? 'bg-cyan-500' : 'bg-amber-500'

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400 w-32 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-medium w-8 text-right">{value}</span>
    </div>
  )
}

export default function ProductModal({ product, onClose }) {
  if (!product) return null

  const scores = product.scores_breakdown || {}

  return (
    <Transition appear show={!!product} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 shadow-xl transition-all">
                {/* Header */}
                <div className="relative p-6 border-b border-gray-800">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-slate-900">
                      {product.rank}
                    </div>
                    <div className="flex-1">
                      <Dialog.Title className="text-xl font-bold text-white">
                        {product.name}
                      </Dialog.Title>
                      <p className="text-gray-400 mt-1">{product.tagline}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-2xl font-bold text-teal-400">
                          {product.unified_score}
                        </span>
                        <span className="text-sm text-gray-500">Unified Score</span>
                        {product.classification && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-xs">
                            {product.classification}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* Problem Quote */}
                  {product.problem_quote && (
                    <div className="p-4 rounded-xl bg-slate-800/50 border-l-4 border-teal-500">
                      <div className="flex items-center gap-2 text-teal-400 mb-2">
                        <AlertTriangle size={16} />
                        <span className="text-sm font-medium">Problem</span>
                      </div>
                      <p className="text-gray-300 italic">"{product.problem_quote}"</p>
                    </div>
                  )}

                  {/* Scores Breakdown */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                      Scoring Breakdown
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(scoreLabels).map(([key, label]) => (
                        <ScoreBar key={key} label={label} value={scores[key]} />
                      ))}
                    </div>
                  </div>

                  {/* Gap Analysis */}
                  {(product.gap_type || product.competitors?.length > 0) && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Gap Analysis
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {product.gap_type && (
                          <div className="p-3 rounded-lg bg-slate-800/50">
                            <div className="text-xs text-gray-500 mb-1">Typ luki</div>
                            <div className="font-medium">{product.gap_type.replace(/_/g, ' ')}</div>
                          </div>
                        )}
                        {product.displacement_potential && (
                          <div className="p-3 rounded-lg bg-slate-800/50">
                            <div className="text-xs text-gray-500 mb-1">Displacement</div>
                            <div className="font-medium">{product.displacement_potential}</div>
                          </div>
                        )}
                      </div>
                      {product.competitors?.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-gray-500 mb-2">Konkurenci</div>
                          <div className="flex flex-wrap gap-2">
                            {product.competitors.slice(0, 5).map((comp, i) => (
                              <span key={i} className="px-2 py-1 rounded-full bg-slate-800 text-xs text-gray-300">
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommendation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.tech_stack && (
                      <div className="p-4 rounded-xl bg-slate-800/50">
                        <div className="flex items-center gap-2 text-sky-400 mb-2">
                          <Cpu size={16} />
                          <span className="text-sm font-medium">Tech Stack</span>
                        </div>
                        <p className="text-sm text-gray-300">{product.tech_stack}</p>
                      </div>
                    )}
                    {product.monetization_model && (
                      <div className="p-4 rounded-xl bg-slate-800/50">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                          <DollarSign size={16} />
                          <span className="text-sm font-medium">Monetyzacja</span>
                        </div>
                        <p className="text-sm text-gray-300">{product.monetization_model}</p>
                      </div>
                    )}
                  </div>

                  {/* Target Personas */}
                  {product.target_personas?.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-800/50">
                      <div className="flex items-center gap-2 text-amber-400 mb-2">
                        <Users size={16} />
                        <span className="text-sm font-medium">Target Persona</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.target_personas.map((persona, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm">
                            {persona}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Source: {product.source}</span>
                    {product.model_count && (
                      <span>Consensus: {product.model_count}/4 modeli</span>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
