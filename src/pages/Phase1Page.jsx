import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Users,
  MessageSquare,
  Search,
  Brain,
  Sparkles,
  Quote,
  TrendingUp,
  Zap,
  Code,
  ShoppingCart,
  Megaphone,
  Video,
  Briefcase,
  Bot,
  ArrowRight,
  Globe,
  Flag,
  Database
} from 'lucide-react'

// Prawdziwe cytaty z danych Airtable
const realQuotes = [
  {
    text: "Szukam PILNIE twórców! Termin: na wczoraj. Poszukujemy rozgadanej dziewczyny do nakręcenia filmików promocyjnych.",
    source: "Grupa FB: Twórcy UGC",
    category: "Content",
    intensity: 5
  },
  {
    text: "I'm in a pretty fragile place financially mimo 134k subskrybentów. You can't rely on AdSense to support your work. It's not enough.",
    source: "r/YouTubers",
    category: "Monetyzacja",
    intensity: 4
  },
  {
    text: "Nieoczekiwany rachunek $1,141 od Vercel. It's honestly a huge financial hit for me personally - więcej niż zarabiam miesięcznie.",
    source: "r/nextjs",
    category: "Tech/Koszty",
    intensity: 5
  },
  {
    text: "System chargebacków jest nadużywany przez klientów. Oszuści wygrywają, a my tracimy towar, pieniądze i opłaty manipulacyjne.",
    source: "r/shopify",
    category: "E-commerce",
    intensity: 5
  },
  {
    text: "Chcę wytestować UGC, ponieważ nigdy nie korzystałem z filmików tego typu. Zależy mi na terminie i na przyzwoitej cenie.",
    source: "Grupa FB: UGC Polska",
    category: "Marketing",
    intensity: 3
  },
  {
    text: "Menedżerowie tracą głowę - vendor podniósł ceny o 40%, a migracja zajęłaby rok pracy inżynierów. Vendor lock-in.",
    source: "r/programming",
    category: "Infrastruktura",
    intensity: 5
  },
  {
    text: "Brak umiejętności monetyzacji dużej publiczności poza AdSense. Spędzam 3h dziennie na ręcznym kopiowaniu danych z PDF do Excela.",
    source: "r/Notion",
    category: "Produktywność",
    intensity: 4
  },
  {
    text: "Wypalenie przy edycji własnych filmów gamingowych. Nie lubię własnego contentu przez montaż, jestem wypalony pracą.",
    source: "r/YouTubers",
    category: "Creator Economy",
    intensity: 4
  }
]

// 8 segmentów badawczych z ikonami
const segments = [
  {
    name: 'AI / Narzędzia AI',
    icon: Bot,
    color: 'from-violet-500 to-purple-600',
    fbGroups: 14,
    subreddits: 33,
    problems: 523,
    description: 'ChatGPT, automatyzacja, uczenie maszynowe, generowanie treści'
  },
  {
    name: 'No-code / Automatyzacja',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    fbGroups: 13,
    subreddits: 11,
    problems: 398,
    description: 'Notion, Zapier, Make, n8n, narzędzia no-code'
  },
  {
    name: 'Programowanie',
    icon: Code,
    color: 'from-cyan-500 to-blue-600',
    fbGroups: 18,
    subreddits: 36,
    problems: 612,
    description: 'Python, JS, React, Cursor, vibe coding'
  },
  {
    name: 'Przedsiębiorcy / Startupy',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-600',
    fbGroups: 25,
    subreddits: 17,
    problems: 445,
    description: 'Startup Poland, SaaS, biznes online'
  },
  {
    name: 'Marketing / Growth',
    icon: Megaphone,
    color: 'from-pink-500 to-rose-600',
    fbGroups: 19,
    subreddits: 18,
    problems: 489,
    description: 'Growth hacking, SEO, social media, ads'
  },
  {
    name: 'Content / Twórcy',
    icon: Video,
    color: 'from-red-500 to-orange-600',
    fbGroups: 13,
    subreddits: 15,
    problems: 568,
    description: 'YouTube, TikTok, UGC, streaming, podcasting'
  },
  {
    name: 'Freelance / Praca zdalna',
    icon: Briefcase,
    color: 'from-indigo-500 to-blue-600',
    fbGroups: 21,
    subreddits: 16,
    problems: 356,
    description: 'Freelancing, remote jobs, zlecenia, CV'
  },
  {
    name: 'E-commerce',
    icon: ShoppingCart,
    color: 'from-green-500 to-emerald-600',
    fbGroups: 16,
    subreddits: 17,
    problems: 612,
    description: 'Shopify, dropshipping, Amazon, Allegro'
  },
]

// Timeline ekspedycji
const timelineSteps = [
  {
    phase: 'Przygotowanie',
    date: '7-8 grudnia',
    title: 'Mapowanie terenu',
    description: 'Wyznaczyliśmy 8 obszarów i 24 tematy do zbadania. Każdy obszar to osobny teren do eksploracji.',
    icon: Compass,
    metric: '24 zapytania'
  },
  {
    phase: 'Ekspedycja FB',
    date: '8 grudnia',
    title: 'Polskie grupy Facebook',
    description: 'Przeszukaliśmy polskie społeczności biznesowe i technologiczne. Każdą grupę zweryfikowaliśmy ręcznie.',
    icon: Flag,
    metric: '105 sprawdzonych (z 139)'
  },
  {
    phase: 'Ekspedycja Reddit',
    date: '9-10 grudnia',
    title: 'Globalne subreddity',
    description: 'Rozszerzyliśmy ekspedycję na anglojęzyczne społeczności. Z 65 do 163 subredditów.',
    icon: Globe,
    metric: '154 aktywne (po weryfikacji)'
  },
  {
    phase: 'Ekstrakcja',
    date: '11-20 grudnia',
    title: 'AI analizuje każdy post',
    description: 'Claude przeanalizował tysiące postów i komentarzy, wydobywając konkretne, rozwiązywalne problemy.',
    icon: Brain,
    metric: '4003 problemy'
  },
]

// Animowany licznik
function AnimatedCounter({ value, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return

    let startTime
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// Komponent karty cytatu
function QuoteCard({ quote, index }) {
  const intensityColors = {
    5: 'border-red-500/50 bg-red-500/5',
    4: 'border-orange-500/50 bg-orange-500/5',
    3: 'border-yellow-500/50 bg-yellow-500/5',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`p-6 rounded-xl border ${intensityColors[quote.intensity] || 'border-slate-700 bg-slate-800/50'}`}
    >
      <Quote className="text-slate-600 mb-3" size={24} />
      <p className="text-gray-300 italic mb-4 leading-relaxed">"{quote.text}"</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">{quote.source}</span>
        <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-400 text-xs">
          {quote.category}
        </span>
      </div>
    </motion.div>
  )
}

// Komponent karty segmentu
function SegmentCard({ segment, index }) {
  const Icon = segment.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="relative p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 transition-all cursor-pointer overflow-hidden group h-full"
    >
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${segment.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${segment.color} flex items-center justify-center`}>
            <Icon className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white">{segment.name}</h3>
        </div>

        <p className="text-sm text-slate-400 mb-4 flex-1">{segment.description}</p>

        <div className="grid grid-cols-3 gap-2 text-center mt-auto">
          <div className="p-2 rounded-lg bg-slate-800/50">
            <div className="text-lg font-bold text-blue-400">{segment.fbGroups}</div>
            <div className="text-xs text-slate-500">FB</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/50">
            <div className="text-lg font-bold text-orange-400">{segment.subreddits}</div>
            <div className="text-xs text-slate-500">Reddit</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/50">
            <div className="text-lg font-bold text-emerald-400">{segment.problems}</div>
            <div className="text-xs text-slate-500">Problemy</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Phase1Page() {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0)

  // Auto-rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % realQuotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-16 pb-20">

      {/* ═══════════════════════════════════════════════════════════════
          AKT I: HERO - Wprowadzenie do ekspedycji
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-4 md:pt-8 pb-8">
        {/* Animated background dots */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-teal-500/20"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm mb-6"
          >
            <Compass size={16} />
            Faza 1: Ekspedycja Badawcza
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight"
          >
            Zanurzyliśmy się w{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              259 społeczności
            </span>
            , <br />gdzie ludzie mówią prawdę
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 mb-8 max-w-2xl leading-relaxed"
          >
            Grupy Facebook. Subreddity. Miejsca, gdzie przedsiębiorcy, programiści i twórcy
            otwarcie dzielą się frustracjami. Zebraliśmy <strong className="text-white">4003 prawdziwe problemy</strong> —
            surowy materiał do odkrycia okazji produktowych.
          </motion.p>

          {/* Key metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-6"
          >
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <Users className="text-blue-400" size={24} />
              <div>
                <div className="text-2xl font-bold text-white">105</div>
                <div className="text-sm text-blue-400">Polskich grup FB</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <MessageSquare className="text-orange-400" size={24} />
              <div>
                <div className="text-2xl font-bold text-white">154</div>
                <div className="text-sm text-orange-400">Subredditów</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <Search className="text-emerald-400" size={24} />
              <div>
                <div className="text-2xl font-bold text-white">4003</div>
                <div className="text-sm text-emerald-400">Problemów</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          AKT II: TIMELINE - Jak przebiegała ekspedycja
      ═══════════════════════════════════════════════════════════════ */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Dziennik Ekspedycji</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Grudzień 2025. Dwa tygodnie intensywnych badań. Oto jak systematycznie
            odkrywaliśmy i dokumentowaliśmy problemy.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line - centered */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500/50 via-cyan-500/50 to-transparent" />

          {/* Timeline items */}
          <div className="space-y-16">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={step.phase}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Mobile layout - always left aligned */}
                  <div className="md:hidden flex gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30 z-10">
                      <Icon className="text-white" size={22} />
                    </div>
                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs mb-2">
                        {step.date}
                      </div>
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-slate-400 text-sm mb-3">{step.description}</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-sm">
                        <Sparkles size={14} className="text-orange-400" />
                        <span className="text-white font-medium">{step.metric}</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout - alternating */}
                  <div className={`hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 items-start`}>
                    {/* Left content or spacer */}
                    <div className={isLeft ? 'text-right pr-4' : ''}>
                      {isLeft && (
                        <>
                          <div className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs mb-2">
                            {step.date}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                          <p className="text-slate-400 mb-3">{step.description}</p>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-sm">
                            <Sparkles size={14} className="text-orange-400" />
                            <span className="text-white font-medium">{step.metric}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Center icon */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30 z-10">
                      <Icon className="text-white" size={26} />
                    </div>

                    {/* Right content or spacer */}
                    <div className={!isLeft ? 'text-left pl-4' : ''}>
                      {!isLeft && (
                        <>
                          <div className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs mb-2">
                            {step.date}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                          <p className="text-slate-400 mb-3">{step.description}</p>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-sm">
                            <Sparkles size={14} className="text-orange-400" />
                            <span className="text-white font-medium">{step.metric}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          AKT III: GŁOSY - Prawdziwe cytaty z danych
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Głosy z Ekspedycji</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            To nie są wymyślone przykłady. To prawdziwe słowa prawdziwych ludzi —
            przedsiębiorców, twórców, programistów. Każdy cytat to potencjalna okazja.
          </p>
        </motion.div>

        {/* Quote carousel - featured */}
        <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuoteIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative z-10"
            >
              <Quote className="text-teal-500/50 mb-4" size={48} />
              <p className="text-2xl text-white leading-relaxed mb-6 max-w-3xl">
                "{realQuotes[activeQuoteIndex].text}"
              </p>
              <div className="flex items-center gap-4">
                <span className="text-slate-400">{realQuotes[activeQuoteIndex].source}</span>
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-sm">
                  Siła problemu: {realQuotes[activeQuoteIndex].intensity}/5
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots indicator */}
          <div className="flex gap-2 mt-8">
            {realQuotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveQuoteIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeQuoteIndex
                    ? 'w-8 bg-teal-500'
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quote grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {realQuotes.slice(0, 6).map((quote, index) => (
            <QuoteCard key={index} quote={quote} index={index} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          AKT IV: SEGMENTY - 8 obszarów badawczych
      ═══════════════════════════════════════════════════════════════ */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">8 Obszarów Badawczych</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Podzieliliśmy ekspedycję na 8 tematycznych segmentów. Każdy to osobny świat
            społeczności ze swoimi unikalnymi problemami i sposobem mówienia.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {segments.map((segment, index) => (
            <SegmentCard key={segment.name} segment={segment} index={index} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          AKT V: PODSUMOWANIE - Wyniki ekspedycji
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent rounded-3xl" />

        <div className="relative p-8 md:p-12 rounded-3xl border border-teal-500/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Rezultaty Ekspedycji</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Dwa tygodnie pracy. Setki godzin analiz AI. Tysiące przeczytanych postów.
              Oto, co przynieśliśmy z powrotem.
            </p>
          </motion.div>

          {/* Big metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-xl bg-slate-900/80"
            >
              <div className="text-5xl font-bold text-white mb-2">
                <AnimatedCounter value={259} />
              </div>
              <div className="text-slate-400">Zbadanych społeczności</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 rounded-xl bg-slate-900/80"
            >
              <div className="text-5xl font-bold text-teal-400 mb-2">
                <AnimatedCounter value={4003} />
              </div>
              <div className="text-slate-400">Zebranych problemów</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 rounded-xl bg-slate-900/80"
            >
              <div className="text-5xl font-bold text-orange-400 mb-2">
                <AnimatedCounter value={8} />
              </div>
              <div className="text-slate-400">Segmentów rynkowych</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 rounded-xl bg-slate-900/80"
            >
              <div className="text-5xl font-bold text-emerald-400 mb-2">
                <AnimatedCounter value={1026} />
              </div>
              <div className="text-slate-400">Najlepszych okazji</div>
            </motion.div>
          </div>

          {/* Transition to Phase 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-lg text-slate-300 mb-6">
              Surowe dane zebrane. Teraz czas na analizę — AI przetworzy te głosy
              w listę najlepszych pomysłów.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/faza-2"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/30"
              >
                Przejdź do Fazy 2: Analiza AI
                <ArrowRight size={20} />
              </a>
              <a
                href="https://airtable.com/appHKTIMXlnFNdCQj/shr18o517TTIGiUSN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-600 text-slate-300 font-medium hover:border-teal-500/50 hover:text-teal-400 transition-all"
              >
                <Database size={18} />
                Przeglądaj surowe dane
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
