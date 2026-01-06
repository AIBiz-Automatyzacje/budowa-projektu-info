import { useState } from 'react'
import Funnel from '../components/Funnel'
import TopGrid from '../components/TopGrid'
import ProductModal from '../components/ProductModal'
import Heatmap from '../components/Heatmap'
import BubbleChart from '../components/BubbleChart'
import dashboardData from '../data/dashboard-data.json'

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          TOP 20 Okazji Produktowych
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Z 4003 problemów zebranych z 105 grup FB i 154 subredditów,
          przez analizę AI 4 modeli, wyłoniliśmy najlepsze okazje na mikro-SaaS.
        </p>
      </header>

      {/* Funnel */}
      <section>
        <Funnel data={dashboardData.funnel} />
      </section>

      {/* TOP 20 Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">TOP 20 Produktów</h2>
        <TopGrid
          products={dashboardData.top20}
          onSelect={setSelectedProduct}
        />
      </section>

      {/* Heatmap */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Mapa Wskaźników</h2>
        <Heatmap products={dashboardData.top20} />
      </section>

      {/* Bubble Chart */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Analiza 4D</h2>
        <BubbleChart
          products={dashboardData.top20}
          onSelect={setSelectedProduct}
        />
      </section>

      {/* Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
