import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Search,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Quote,
  Lightbulb,
  TrendingDown,
  Brain,
  Bot,
  Target,
  Trophy
} from 'lucide-react'

// Cytaty z prawdziwych problemów
const realQuotes = [
  {
    text: "Freelancer zniknął z połową projektu i moją zaliczką...",
    category: "Zlecenia"
  },
  {
    text: "Spędzam 15h tygodniowo na szukaniu zleceń zamiast na pracy...",
    category: "Freelance"
  },
  {
    text: "Stany magazynowe się rozjechały — sprzedałem towar, którego nie mam...",
    category: "E-commerce"
  }
]

// Modele AI z cytatami z ich odkryć
const aiModels = [
  {
    name: 'Claude Opus 4.5',
    company: 'Anthropic',
    color: 'amber',
    role: 'Ukryte prawidłowości',
    insight: '48% problemów łączy jeden wzorzec: deficyt zaufania do freelancerów i narzędzi AI'
  },
  {
    name: 'Gemini 3 Pro',
    company: 'Google',
    color: 'sky',
    role: 'Powiązania między branżami',
    insight: 'Klienci zmęczeni agencjami, które obiecują wyniki, a dowożą brak efektów'
  },
  {
    name: 'Grok 4',
    company: 'xAI',
    color: 'rose',
    role: 'Emocje i frustracje',
    insight: 'Freelancerzy wypalają się prospectingiem, nie samą pracą — 15-30h tygodniowo na szukanie klientów'
  },
  {
    name: 'GPT-5.2',
    company: 'OpenAI',
    color: 'emerald',
    role: 'Porządkowanie',
    insight: '40% problemów to za słaba jakość istniejących rozwiązań — nie brak rozwiązań'
  }
]

// Frameworki analizy
const frameworks = [
  {
    name: 'Pain Radar',
    subtitle: 'Analiza problemów',
    icon: Search,
    color: 'teal',
    description: 'Zbieramy problemy z grup i forów, oceniamy jak bardzo bolą (skala 1-5), sortujemy po kategoriach.'
  },
  {
    name: 'Gap Hunter Lite',
    subtitle: 'Analiza konkurencji',
    icon: Layers,
    color: 'cyan',
    description: 'Sprawdzamy istniejące rozwiązania, oceniamy ich słabe strony i szukamy nisz bez dobrej konkurencji.'
  },
  {
    name: 'Product Finder',
    subtitle: 'Ocena wykonalności',
    icon: Sparkles,
    color: 'orange',
    description: 'Oceniamy trudność techniczną każdego pomysłu z perspektywy vibe codera.'
  }
]

// TOP 5 ukrytych wzorców
const hiddenPatterns = [
  {
    name: 'Brak zaufania',
    score: 73,
    affected: '48%',
    categories: ['Zlecenia', 'Automatyzacja', 'Marketing', 'PM'],
    description: 'Użytkownicy nie ufają ani ludziom (freelancerzy, agencje), ani narzędziom (AI, automatyzacje). Strach przed halucynacjami, niedowiezieniem, brakiem odpowiedzialności.',
    opportunity: 'Platforma z wbudowanym QA, checkpointami i mierzalnymi KPI'
  },
  {
    name: 'Przepaść między pomysłodawcą a wykonawcą',
    score: 74,
    affected: '24%',
    categories: ['Zlecenia', 'Strategia', 'Marketing', 'Analityka'],
    description: 'Osoby z pomysłem nie mają umiejętności technicznych. Osoby techniczne nie umieją sprzedawać. Obie strony szukają "drugiej połówki" ale nie wiedzą jak ją zweryfikować.',
    opportunity: 'Matchmaking z mini-projektem testowym przed pełną współpracą'
  },
  {
    name: 'Przeciążenie czasowe',
    score: 71,
    affected: '46%',
    categories: ['Marketing', 'E-commerce', 'PM', 'Content'],
    description: 'Problem to nie brak wiedzy, tylko brak czasu i energii. Ręczne procesy wypychają pracę strategiczną.',
    opportunity: 'Done-for-you automation zamiast kolejnych narzędzi DIY'
  },
  {
    name: 'Wypalenie od szukania klientów',
    score: 66,
    affected: '16%',
    categories: ['Marketing', 'Zlecenia', 'Strategia'],
    description: 'Freelancerzy spędzają 15-30h tygodniowo na szukaniu klientów. Cold outreach ma 1% skuteczność, LinkedIn nasycony.',
    opportunity: 'Reverse Job Board — klienci postują problemy, freelancerzy licytują rozwiązaniami'
  },
  {
    name: 'Kryzys zaufania do agencji',
    score: 66,
    affected: '16%',
    categories: ['Marketing', 'Zlecenia', 'Strategia', 'Wdrożenia'],
    description: 'Klienci zmęczeni agencjami, które obiecują wyniki, a dowożą brak efektów, słabą komunikację lub znikają po zaliczce.',
    opportunity: 'Agency Auditor — automatyczny audyt czy agencja naprawdę pracuje'
  }
]

// Etapy lejka
const funnelSteps = [
  { value: 4003, label: 'Wszystkie zebrane problemy', description: 'Każdy z nich to historia czyjegoś dnia, który poszedł nie tak' },
  { value: 1026, label: 'Sprawdzone', description: 'Tylko te, które naprawdę bolą (siła ≥3)' },
  { value: 417, label: 'Okazje z 4 modeli AI', description: 'Gdzie 4 różne perspektywy widzą potencjał' },
  { value: 358, label: 'Bez powtórek', description: 'Czysta lista po usunięciu duplikatów' },
  { value: 20, label: 'TOP okazji', description: 'Gotowe do zbudowania' }
]

// Komponent karty wzorca
function PatternCard({ pattern, index }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <span className="text-teal-400 font-bold">{pattern.score}</span>
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-white">{pattern.name}</h4>
            <p className="text-sm text-slate-500">Dotyczy {pattern.affected} problemów</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="text-slate-500" size={20} />
        ) : (
          <ChevronDown className="text-slate-500" size={20} />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pr-5 pb-5 pl-[76px] space-y-4">
              {/* Kategorie */}
              <div className="flex flex-wrap gap-2 mt-1">
                {pattern.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-2 py-1 text-xs rounded-full bg-slate-800 text-slate-400"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Opis */}
              <p className="text-slate-400 text-sm leading-relaxed">
                {pattern.description}
              </p>

              {/* Szansa */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Lightbulb className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs text-amber-400/70 uppercase tracking-wide mb-1">Szansa produktowa</p>
                  <p className="text-sm text-amber-100">{pattern.opportunity}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Phase2Page() {
  return (
    <div className="space-y-16 pb-24">

      {/* ===== SEKCJA 1: HERO ===== */}
      <section className="relative pt-4 md:pt-8 pb-8">
        {/* Animated background dots */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-orange-500/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-400 text-sm mb-6"
          >
            <Brain size={16} />
            Faza 2: Analiza AI
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight"
          >
            Od{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              4003 głosów
            </span>{' '}
            do{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              20 okazji
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 mb-8 max-w-2xl leading-relaxed"
          >
            Jak <strong className="text-white">4 modele AI</strong> odkryły wzorce,
            których ludzie nie widzieli. Każdy model widzi dane inaczej —
            razem widzą pełny obraz.
          </motion.p>

          {/* Key metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-6"
          >
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-orange-500/15 border border-orange-500/40">
              <Bot className="text-orange-400" size={24} />
              <div>
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-sm text-orange-400">Modele AI</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <Target className="text-cyan-400" size={24} />
              <div>
                <div className="text-2xl font-bold text-white">31</div>
                <div className="text-sm text-cyan-400">Wzorców</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <Trophy className="text-emerald-400" size={24} />
              <div>
                <div className="text-2xl font-bold text-white">20</div>
                <div className="text-sm text-emerald-400">TOP okazji</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SEKCJA: GŁOSY Z DANYCH ===== */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Głosy, które analizowaliśmy</h2>
          <p className="text-slate-400">Prawdziwe problemy prawdziwych ludzi</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {realQuotes.map((quote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <Quote className="absolute -top-2 -left-2 text-teal-500/30" size={24} />
              <p className="text-slate-300 text-sm italic mb-3 leading-relaxed">"{quote.text}"</p>
              <span className="px-2 py-1 text-xs rounded-full bg-slate-800 text-slate-400">{quote.category}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SEKCJA 2: MODELE AI ===== */}
      <section>
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Cztery perspektywy analizy
          </motion.h2>
          <p className="text-slate-400">
            Każdy model widzi dane inaczej. Razem widzą pełny obraz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiModels.map((model, i) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300"
            >
              <div className={`w-3 h-3 rounded-full mb-4 ${
                model.color === 'amber' ? 'bg-amber-500' :
                model.color === 'sky' ? 'bg-sky-500' :
                model.color === 'rose' ? 'bg-rose-500' :
                'bg-emerald-500'
              }`} />
              <h3 className="font-semibold text-white mb-1">{model.name}</h3>
              <p className="text-xs text-slate-600 mb-3">{model.company}</p>
              <p className={`text-xs font-medium mb-3 ${
                model.color === 'amber' ? 'text-amber-400' :
                model.color === 'sky' ? 'text-sky-400' :
                model.color === 'rose' ? 'text-rose-400' :
                'text-emerald-400'
              }`}>{model.role}</p>
              <p className="text-sm text-slate-400 leading-relaxed">
                "{model.insight}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SEKCJA 3: FRAMEWORKI ===== */}
      <section>
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Jak szukaliśmy okazji
          </motion.h2>
          <p className="text-slate-400">
            Trzy metody. Trzy perspektywy. Jeden cel: znaleźć to, co warto zbudować.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {frameworks.map((fw, i) => {
            const Icon = fw.icon
            return (
              <motion.div
                key={fw.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-slate-900 border border-slate-800"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                  fw.color === 'teal' ? 'bg-teal-500/20' :
                  fw.color === 'cyan' ? 'bg-cyan-500/20' :
                  'bg-orange-500/20'
                }`}>
                  <Icon className={
                    fw.color === 'teal' ? 'text-teal-400' :
                    fw.color === 'cyan' ? 'text-cyan-400' :
                    'text-orange-400'
                  } size={28} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{fw.name}</h3>
                <p className={`text-sm mb-4 ${
                  fw.color === 'teal' ? 'text-teal-400' :
                  fw.color === 'cyan' ? 'text-cyan-400' :
                  'text-orange-400'
                }`}>{fw.subtitle}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{fw.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ===== SEKCJA 4: UKRYTE WZORCE ===== */}
      <section>
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            31 wzorców, których nikt nie widział
          </motion.h2>
          <p className="text-slate-400">
            AI znalazło połączenia między kategoriami, które umykają ludzkiemu oku.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {hiddenPatterns.map((pattern, i) => (
            <PatternCard key={pattern.name} pattern={pattern} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-600 text-sm mt-6"
        >
          + 26 kolejnych wzorców w pełnym raporcie
        </motion.p>
      </section>

      {/* ===== SEKCJA 5: TIMELINE/LEJEK ===== */}
      <section>
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Od chaosu do klarowności
          </motion.h2>
          <p className="text-slate-400">
            Każdy etap to filtr. Każdy filtr to decyzja.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {funnelSteps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex items-center gap-6 mb-2">
                {/* Liczba */}
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  i === funnelSteps.length - 1
                    ? 'bg-gradient-to-br from-orange-600 to-amber-500'
                    : 'bg-slate-900 border border-slate-800'
                }`}>
                  <span className={`text-2xl font-bold ${
                    i === funnelSteps.length - 1 ? 'text-white' : 'text-teal-400'
                  }`}>
                    {step.value.toLocaleString()}
                  </span>
                </div>

                {/* Tekst */}
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{step.label}</h4>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
              </div>

              {/* Strzałka w dół */}
              {i < funnelSteps.length - 1 && (
                <div className="flex justify-start pl-10 py-2">
                  <TrendingDown className="text-slate-700" size={24} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SEKCJA 6: CTA ===== */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-teal-500/10 to-orange-500/15 border border-orange-500/30"
        >
          <h2 className="text-2xl font-bold mb-4">
            Wyłoniliśmy TOP 20
          </h2>
          <p className="text-slate-400 mb-6">
            Z 4003 problemów AI wybrało 20 najlepszych okazji produktowych.
            Teraz wybieramy, którą zbudujemy pierwszą.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-400 hover:to-cyan-400 transition-all"
          >
            Zobacz dashboard
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

    </div>
  )
}
