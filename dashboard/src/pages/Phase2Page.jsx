import { Brain, Layers, Search, Sparkles } from 'lucide-react'

const frameworks = [
  {
    name: 'Pain Radar',
    subtitle: 'Bottom-up Analysis',
    icon: Search,
    color: 'blue',
    description: 'Analiza od dołu: agregacja problemów, scoring kategorii, wykrywanie ukrytych wzorców.',
    steps: [
      'Agregacja 4003 problemów do 23 kategorii',
      'Pain Priority Score (PPS) dla każdej kategorii',
      'Wykrycie 31 ukrytych wzorców cross-kategorialnych',
      'Deep dive w top 10 kategorii',
    ],
  },
  {
    name: 'Gap Hunter Lite',
    subtitle: 'Top-down Analysis',
    icon: Layers,
    color: 'green',
    description: 'Analiza od góry: mapowanie konkurencji, scoring white space, identyfikacja luk.',
    steps: [
      'Typowanie luk (8 typów: za wolne, za drogie, etc.)',
      'Mapowanie 15 głównych konkurentów',
      'White Space Scoring (0-100)',
      'Community Fit z Pain Radar',
    ],
  },
  {
    name: 'Low-Code Product Finder',
    subtitle: 'Opportunity Scoring',
    icon: Sparkles,
    color: 'purple',
    description: 'Scoring możliwości pod kątem MVP low-code: prostota, AI leverage, monetyzacja.',
    steps: [
      '6 wymiarów scoringu (problem clarity, MVP simplicity, etc.)',
      'Klasyfikacja wzorców (AI Generator, Simplifier, etc.)',
      'Consensus bonus za zgodność modeli',
      '402 okazje z klasyfikacją EXCELLENT/STRONG/GOOD',
    ],
  },
]

const models = [
  { name: 'Claude Opus 4', company: 'Anthropic', color: 'orange' },
  { name: 'Gemini 2.5 Pro', company: 'Google', color: 'blue' },
  { name: 'Grok 3', company: 'xAI', color: 'red' },
  { name: 'O3 Mini High', company: 'OpenAI', color: 'green' },
]

export default function Phase2Page() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold mb-4">Faza 2: Analiza AI</h1>
        <p className="text-gray-400 max-w-3xl">
          Multi-model approach: 4 najlepsze modele AI analizują dane równolegle.
          Dwa komplementarne frameworki (bottom-up i top-down) zapewniają pełny obraz.
        </p>
      </header>

      {/* Models */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">4 Modele AI</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((model) => (
            <div
              key={model.name}
              className={`p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-${model.color}-500/50 transition-colors`}
            >
              <div className={`w-3 h-3 rounded-full bg-${model.color}-500 mb-3`}></div>
              <h3 className="font-semibold">{model.name}</h3>
              <p className="text-sm text-gray-500">{model.company}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Każdy problem analizowany przez wszystkie 4 modele. Consensus scoring nagradza zgodność.
        </p>
      </section>

      {/* Frameworks */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Frameworki Analizy</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {frameworks.map(({ name, subtitle, icon: Icon, color, description, steps }) => (
            <div
              key={name}
              className="p-6 rounded-xl bg-gray-900 border border-gray-800"
            >
              <div className={`w-12 h-12 rounded-lg bg-${color}-500/20 flex items-center justify-center mb-4`}>
                <Icon className={`text-${color}-400`} size={24} />
              </div>
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
              <p className="text-gray-400 text-sm mb-4">{description}</p>
              <ul className="space-y-2">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className={`w-5 h-5 rounded-full bg-${color}-500/20 text-${color}-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5`}>
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring Formula */}
      <section className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Brain size={24} className="text-purple-400" />
          Formuła Unified Score
        </h2>
        <div className="font-mono text-sm bg-gray-950 rounded-lg p-4 overflow-x-auto">
          <pre className="text-gray-300">
{`UNIFIED_SCORE =
  // Dla lowcode opportunities:
  final_score × 0.70 + (model_count / 4) × 30

  // Dla gap-hunter MVPs:
  combined_score × 0.50 +
  (white_space_score / 100) × 25 +
  (community_fit_norm / 100) × 25

// Waga klasyfikacji:
EXCELLENT / STRONG_GO = 1.0
STRONG / GO = 0.9
GOOD / CONSIDER = 0.8`}
          </pre>
        </div>
      </section>

      {/* Output */}
      <section className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <h2 className="text-xl font-semibold mb-4">Output Fazy 2</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-purple-400">454</div>
            <div className="text-gray-400">okazji zidentyfikowanych</div>
            <div className="text-sm text-gray-500 mt-1">402 lowcode + 52 gap-hunter</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">358</div>
            <div className="text-gray-400">unikalnych po deduplikacji</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">20</div>
            <div className="text-gray-400">TOP okazji</div>
            <div className="text-sm text-gray-500 mt-1">Score 87-97</div>
          </div>
        </div>
      </section>
    </div>
  )
}
