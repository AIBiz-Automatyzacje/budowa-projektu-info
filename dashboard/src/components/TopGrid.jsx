import ProductCard from './ProductCard'

export default function TopGrid({ products, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onSelect(product)}
        />
      ))}
    </div>
  )
}
