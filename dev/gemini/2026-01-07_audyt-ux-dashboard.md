# Audyt UX/UI Dashboardu

**Data:** 2026-01-07
**Źródło:** Gemini CLI
**Zapytanie:** Audyt designu UX‑u naszego projektu. Jak możemy poprawić jego wygląd, doświadczenie użytkownika, który będzie zapoznawał się z informacjami na naszych trzech podstronach?

---

## Odpowiedź Gemini

### 🔍 Audyt UX/UI Dashboardu

Przeprowadziłem audyt plików w folderze `dashboard/` i oto główne wnioski oraz proponowane usprawnienia:

1.  **Nawigacja i Hierarchia**:
    *   **Problem**: Strona główna ("TOP 20") wyświetla dużo kart na raz bez możliwości zawężania wyników. Użytkownik może czuć się przytłoczony.
    *   **Rozwiązanie**: Dodanie paska **Filtrów i Sortowania**.

2.  **Prezentacja Danych (Karty Produktów)**:
    *   **Problem**: Karty są "gęste". Tagline jest ucięty. Badge kategorii jest mało widoczny.
    *   **Rozwiązanie**: Poprawa kontrastu, wyraźniejsze oznaczenie kategorii (kolorowe akcenty) i dodanie akcji "Zobacz szczegóły" po najechaniu (hover).

3.  **Szczegóły (Modal Produktu)**:
    *   **Problem**: Modal to "ściana tekstu" i lista pasków postępu. Trudno szybko ocenić mocne/słabe strony okazji.
    *   **Rozwiązanie**: Zastąpienie listy pasków **Wykresem Radarowym (Radar Chart)**. Pozwoli to na błyskawiczną ocenę profilu (np. "Silne technicznie, słabe biznesowo").

---

### 🛠️ Implementacja Usprawnień

Poniżej znajduje się kod dla trzech kluczowych komponentów.

#### 1. Nowy komponent: `src/components/FilterBar.jsx`
Ten komponent pozwoli użytkownikom filtrować okazje po kategorii (Pattern) i sortować je (np. po ocenie lub rankingu).

```jsx
import { Filter, SortAsc, SortDesc } from 'lucide-react'

const patterns = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'AI_GENERATOR', label: 'Generator' },
  { id: 'SIMPLIFIER', label: 'Simplifier' },
  { id: 'AI_ASSISTANT', label: 'Asystent' },
  { id: 'AGGREGATOR', label: 'Agregator' },
  { id: 'MONITOR_ALERT', label: 'Monitor' },
  { id: 'TEMPLATE_PACK', label: 'Szablony' },
]

const sortOptions = [
  { id: 'score_desc', label: 'Score: Najwyższy' },
  { id: 'score_asc', label: 'Score: Najniższy' },
  { id: 'rank_asc', label: 'Ranking: 1-20' },
]

export default function FilterBar({
  activePattern,
  onPatternChange,
  sortOption,
  onSortChange
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl mb-8 backdrop-blur-sm sticky top-20 z-40 shadow-xl shadow-black/20">

      {/* Pattern Filter */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
        <Filter size={20} className="text-teal-500 flex-shrink-0" />
        <div className="flex gap-2">
          {patterns.map((pat) => (
            <button
              key={pat.id}
              onClick={() => onPatternChange(pat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activePattern === pat.id
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-transparent hover:border-slate-600'
              }`}
            >
              {pat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          {sortOption.includes('desc') ? <SortDesc size={14} /> : <SortAsc size={14} />}
          Sortowanie
        </span>
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-slate-800 text-slate-200 text-sm rounded-lg pl-3 pr-8 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 cursor-pointer hover:border-slate-600 transition-colors"
          >
            {sortOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
```

#### 2. Aktualizacja: `src/pages/HomePage.jsx`
Integruje pasek filtrów i logikę filtrowania/sortowania danych JSON.

```jsx
import { useState, useMemo } from 'react'
import Funnel from '../components/Funnel'
import TopGrid from '../components/TopGrid'
import ProductModal from '../components/ProductModal'
import Heatmap from '../components/Heatmap'
import BubbleChart from '../components/BubbleChart'
import FilterBar from '../components/FilterBar' // Importujemy nowy komponent
import dashboardData from '../data/dashboard-data.json'

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activePattern, setActivePattern] = useState('all')
  const [sortOption, setSortOption] = useState('score_desc')

  // Logika filtrowania i sortowania
  const filteredProducts = useMemo(() => {
    let result = [...dashboardData.top20]

    // 1. Filter by Pattern
    if (activePattern !== 'all') {
      result = result.filter(product => {
        if (Array.isArray(product.pattern)) {
          return product.pattern.includes(activePattern)
        }
        return product.pattern === activePattern || product.pattern?.startsWith(activePattern)
      })
    }

    // 2. Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'score_desc':
          return b.unified_score - a.unified_score
        case 'score_asc':
          return a.unified_score - b.unified_score
        case 'rank_asc':
          return a.rank - b.rank
        default:
          return 0
      }
    })

    return result
  }, [activePattern, sortOption])

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium mb-4 border border-teal-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          Live Data: 7 Jan 2026
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
          TOP 20 Okazji Produktowych
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Z 4003 problemów zebranych z 105 grup FB i 154 subredditów,
          wyłoniliśmy najlepsze okazje na mikro-SaaS.
        </p>
      </header>

      {/* Funnel */}
      <section>
        <Funnel data={dashboardData.funnel} />
      </section>

      {/* Main Content Area with Filters */}
      <section className="relative min-h-[600px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Ranking Okazji</h2>
          <span className="text-sm text-slate-500">
            Znaleziono: <strong className="text-white">{filteredProducts.length}</strong>
          </span>
        </div>

        <FilterBar
          activePattern={activePattern}
          onPatternChange={setActivePattern}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />

        <TopGrid
          products={filteredProducts}
          onSelect={setSelectedProduct}
        />

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Brak wyników dla wybranych filtrów.
          </div>
        )}
      </section>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <section className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            Mapa Wskaźników
          </h2>
          <Heatmap products={filteredProducts.length > 0 ? filteredProducts : dashboardData.top20} />
        </section>

        <section className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800">
          <h2 className="text-xl font-semibold mb-6">Analiza 4D</h2>
          <BubbleChart
            products={filteredProducts.length > 0 ? filteredProducts : dashboardData.top20}
            onSelect={setSelectedProduct}
          />
        </section>
      </div>

      {/* Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
```

#### 3. Ulepszony: `src/components/ProductModal.jsx`
Dodaje wykres radarowy (wymaga `recharts`, który jest w projekcie) dla lepszej wizualizacji.

```jsx
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { X, AlertTriangle, Target, Zap, DollarSign, Cpu, Users, BarChart2 } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

// Mapowanie kluczy score na czytelne etykiety do wykresu
const radarLabels = {
  problem_clarity: 'Jasność',
  mvp_simplicity: 'Prostota',
  ai_leverage: 'AI',
  mobile_fit: 'Mobile',
  monetization: '$$$',
  competition_gap: 'Luka',
  white_space: 'White Space',
  community_fit: 'Community',
}

export default function ProductModal({ product, onClose }) {
  if (!product) return null

  // Transform data for Radar Chart
  const scores = product.scores_breakdown || {}
  const radarData = Object.entries(scores).map(([key, value]) => ({
    subject: radarLabels[key] || key,
    A: value,
    fullMark: 100,
  }))

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
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl transition-all text-left">

                {/* 1. Header Area */}
                <div className="relative p-6 md:p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800/50">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>

                  <div className="flex flex-col md:flex-row gap-6 md:items-start">
                    {/* Rank Box */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/20 flex flex-col items-center justify-center text-slate-900">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-75">Rank</span>
                        <span className="text-3xl font-bold leading-none">{product.rank}</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        {product.classification && (
                          <span className="px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-wide border border-teal-500/20">
                            {product.classification}
                          </span>
                        )}
                        <span className="text-slate-500 text-sm font-medium">
                          {product.gap_type?.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <Dialog.Title className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        {product.name}
                      </Dialog.Title>

                      <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                        {product.tagline}
                      </p>
                    </div>

                    {/* Score Big Display */}
                    <div className="hidden md:flex flex-col items-end">
                       <div className="text-4xl font-bold text-teal-400 tabular-nums">
                         {product.unified_score}
                       </div>
                       <span className="text-xs text-slate-500 uppercase tracking-wider">Unified Score</span>
                    </div>
                  </div>
                </div>

                {/* 2. Main Content Grid */}
                <div className="grid md:grid-cols-12 min-h-[500px]">

                  {/* Left Column: Visuals & Stats (5 cols) */}
                  <div className="md:col-span-5 p-6 border-r border-slate-800 bg-slate-900/50">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                      <BarChart2 size={16} />
                      Profil Okazji
                    </h3>

                    {/* Radar Chart */}
                    <div className="h-[300px] w-full -ml-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid stroke="#334155" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            name="Score"
                            dataKey="A"
                            stroke="#14b8a6"
                            strokeWidth={2}
                            fill="#14b8a6"
                            fillOpacity={0.3}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                            itemStyle={{ color: '#2dd4bf' }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                        <div className="text-xs text-slate-500 mb-1">Potencjał</div>
                        <div className="font-semibold text-teal-400">{product.displacement_potential || 'N/A'}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                        <div className="text-xs text-slate-500 mb-1">Modeli</div>
                        <div className="font-semibold text-white">{product.model_count}/4</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Details & Text (7 cols) */}
                  <div className="md:col-span-7 p-6 md:p-8 space-y-8 overflow-y-auto max-h-[600px]">

                    {/* Problem Section */}
                    <section>
                      <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Zidentyfikowany Problem
                      </h3>
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 italic text-slate-300 leading-relaxed">
                        "{product.problem_quote}"
                      </div>
                    </section>

                    {/* Tech & Biz Stack */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <section>
                         <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Cpu size={16} />
                          Tech Stack
                        </h3>
                        <p className="text-sm text-slate-300">{product.tech_stack}</p>
                      </section>
                      <section>
                         <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <DollarSign size={16} />
                          Monetyzacja
                        </h3>
                        <p className="text-sm text-slate-300">{product.monetization_model}</p>
                      </section>
                    </div>

                    {/* Target & Competitors */}
                    <section>
                       <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Target size={16} />
                        Target & Konkurencja
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.target_personas?.map((persona, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs border border-slate-700">
                            {persona}
                          </span>
                        ))}
                      </div>
                      {product.competitors?.length > 0 && (
                        <div className="text-xs text-slate-500">
                          Konkurenci: <span className="text-slate-400">{product.competitors.join(', ')}</span>
                        </div>
                      )}
                    </section>

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
```

---

*Wygenerowano przez /gemini*
