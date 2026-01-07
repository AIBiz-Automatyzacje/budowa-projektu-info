import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Trophy } from 'lucide-react'
import ProductCard, { patternDescriptions } from './ProductCard'

const patterns = [
  { key: 'AI_GENERATOR', label: 'Generator', color: 'bg-teal-500', textColor: 'text-teal-400' },
  { key: 'SIMPLIFIER', label: 'Simplifier', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  { key: 'AI_ASSISTANT', label: 'Asystent', color: 'bg-sky-500', textColor: 'text-sky-400' },
  { key: 'AGGREGATOR', label: 'Agregator', color: 'bg-orange-500', textColor: 'text-orange-400' },
  { key: 'MONITOR_ALERT', label: 'Monitor', color: 'bg-rose-500', textColor: 'text-rose-400' },
  { key: 'TEMPLATE_PACK', label: 'Szablony', color: 'bg-violet-500', textColor: 'text-violet-400' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

const heroVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20
    }
  }
}

export default function TopGrid({ products, onSelect }) {
  const [isLegendOpen, setIsLegendOpen] = useState(false)

  // Split products: TOP 3 as heroes, rest as regular
  const heroProducts = products.slice(0, 3)
  const regularProducts = products.slice(3)

  return (
    <div className="space-y-8">
      {/* Legenda kategorii - zwijana */}
      <motion.div
        className="glass rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Nagłówek - kliknij żeby rozwinąć */}
        <button
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm font-medium">Kategorie produktów</span>
            <div className="flex items-center gap-2">
              {patterns.map((pattern) => (
                <motion.span
                  key={pattern.key}
                  className={`w-2.5 h-2.5 rounded-full ${pattern.color}`}
                  whileHover={{ scale: 1.5 }}
                />
              ))}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isLegendOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} className="text-slate-400" />
          </motion.div>
        </button>

        {/* Tabelka z opisami */}
        <AnimatePresence>
          {isLegendOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {patterns.map((pattern) => (
                    <motion.div
                      key={pattern.key}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30"
                      whileHover={{ scale: 1.02, borderColor: 'rgba(20, 184, 166, 0.3)' }}
                    >
                      <span className={`w-3 h-3 rounded-full ${pattern.color} mt-0.5 flex-shrink-0`} />
                      <div>
                        <div className={`font-medium text-sm ${pattern.textColor}`}>
                          {pattern.label}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {patternDescriptions[pattern.key]}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* TOP 3 Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Trophy size={20} className="text-slate-900" />
          </motion.div>
          <div>
            <h3 className="font-display font-semibold text-xl text-white">Podium TOP 3</h3>
            <p className="text-sm text-slate-400">Najlepsze okazje produktowe</p>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {heroProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={heroVariants}
              className="h-full"
              style={{ minHeight: '380px' }}
            >
              <ProductCard
                product={product}
                onClick={() => onSelect(product)}
                index={index}
                isHero={true}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Rest of the products */}
      {regularProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <span className="text-slate-500 text-sm font-medium px-4">Pozostałe okazje</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-stretch"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {regularProducts.map((product, index) => (
              <motion.div key={product.id} variants={itemVariants} className="h-full">
                <ProductCard
                  product={product}
                  onClick={() => onSelect(product)}
                  index={index + 3}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
