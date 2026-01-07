import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowDown } from 'lucide-react'
import Funnel from '../components/Funnel'
import TopGrid from '../components/TopGrid'
import ProductModal from '../components/ProductModal'
import Heatmap from '../components/Heatmap'
import dashboardData from '../data/dashboard-data.json'

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <div className="space-y-16 pb-24">
      {/* Hero Header */}
      <motion.header
        className="text-center pt-8 pb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles size={16} className="text-teal-400" />
          <span className="text-sm text-teal-300 font-medium">Sprawdzone przez 4 AI</span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          TOP 20 Pomysłów na Biznes
        </motion.h1>

        <motion.p
          className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Przeanalizowaliśmy <span className="text-teal-400 font-mono font-semibold">4003</span> problemy z{' '}
          <span className="text-sky-400 font-mono font-semibold">105</span> grup FB i{' '}
          <span className="text-orange-400 font-mono font-semibold">154</span> subredditów.
          4 modele AI wybrały 20 pomysłów z największym potencjałem.
        </motion.p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-slate-500 text-sm"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown size={16} />
            <span>Odkryj TOP 20 ↓</span>
          </motion.div>
        </motion.div>
      </motion.header>

      {/* Funnel */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <Funnel data={dashboardData.funnel} />
      </motion.section>

      {/* TOP 20 Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-orange-500/30 to-transparent" />
          <h2 className="text-3xl font-display font-bold text-white">Ranking TOP 20</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 via-50% via-teal-500/50 to-transparent" />
        </div>
        <TopGrid
          products={dashboardData.top20}
          onSelect={setSelectedProduct}
        />
      </motion.section>

      {/* Heatmap */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <Heatmap products={dashboardData.top20} />
      </motion.section>

      {/* Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
