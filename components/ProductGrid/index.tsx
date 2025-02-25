import { useState } from 'react';
import Image from 'next/image';
import productsData from '@/data/products.json';
import { useFilterStore } from '@/store/useFilterStore';
import { useCartStore } from '@/store/useCartStore';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  tags: string[];
  category: string;
}

const ProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart: (item: Omit<Product, 'tags' | 'category'>) => void }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      <div className="relative h-56">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-playfair text-xl font-bold text-gray-800 group-hover:text-[#1a472a] transition-colors duration-300">
            {product.name}
          </h3>
          <span className="text-2xl font-bold text-[#1a472a] bg-[#1a472a]/10 px-4 py-1 rounded-full">
            ${product.price}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span 
              key={tag} 
              className="inline-flex items-center gap-1.5 text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium hover:bg-[#1a472a]/10 hover:text-[#1a472a] transition-colors duration-300"
            >
              {tag === 'Épicé' && '🌶️'}
              {tag === 'Végétarien' && '🥬'}
              {tag === 'Halal' && '🥩'}
              {tag === 'Sucré' && '🍯'}
              {tag}
            </span>
          ))}
        </div>

        <button 
          onClick={() => onAddToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
          })}
          className="w-full bg-[#1a472a] text-white py-3 rounded-xl
                    font-bold tracking-wide
                    transition-all duration-500
                    relative overflow-hidden
                    transform hover:scale-[1.02]
                    shadow-lg hover:shadow-[#1a472a]/30
                    flex items-center justify-center gap-3
                    before:absolute before:inset-0 
                    before:bg-gradient-to-r before:from-[#2c5545] before:to-[#1a472a]
                    before:opacity-0 hover:before:opacity-100
                    before:transition-opacity before:duration-500"
        >
          <span className="relative z-10">Ajouter au panier</span>
          <svg className="w-5 h-5 relative z-10 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const FilterSidebar = ({ 
  category,
  setCategory,
  priceRange,
  setPriceRange,
  selectedTags,
  setSelectedTags,
  products
}: {
  category: string;
  setCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  products: Product[];
}) => {
  return (
    <div className="w-full md:w-72 bg-gradient-to-br from-[#CECE5A]/80 to-[#78c30a]/60 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-[#78c30a]/30 hover:border-[#78c30a]/50 transition-all duration-300">
      <h3 className="font-playfair text-3xl mb-8 text-[#1a472a] font-bold text-center">✨ Filtres ✨</h3>
      
      <div className="mb-10">
        <label className="block text-lg font-medium mb-4 text-[#1a472a]">Catégorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl border-2 border-[#78c30a]/30 focus:border-[#78c30a] focus:ring-4 focus:ring-[#78c30a]/20 bg-white/70 backdrop-blur-sm text-[#1a472a] font-medium hover:border-[#78c30a]/50 transition-all duration-300 cursor-pointer"
        >
          <option value="Tout">✨ Toutes les catégories</option>
          <option value="Traditionnel">🍲 Traditionnel</option>
          <option value="Fast Food">🍔 Fast Food</option>
          <option value="Desserts">🍰 Desserts</option>
        </select>
      </div>
      
      <div className="mb-10">
        <label className="block text-lg font-medium mb-4 text-[#1a472a]">Prix</label>
        <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#78c30a]/30 focus:border-[#78c30a] bg-white/70 text-[#1a472a] font-medium"
            min="0"
          />
          <span className="text-[#1a472a] font-bold">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#78c30a]/30 focus:border-[#78c30a] bg-white/70 text-[#1a472a] font-medium"
            min="0"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-lg font-medium mb-4 text-[#1a472a]">Tags</label>
        <div className="grid grid-cols-2 gap-4">
          {Array.from(new Set(products.flatMap(p => p.tags))).map(tag => (
            <button
              key={tag}
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter(t => t !== tag));
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
              className={`flex items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                selectedTags.includes(tag)
                  ? 'bg-[#78c30a] text-white shadow-lg'
                  : 'bg-white/50 text-[#1a472a] hover:bg-white/70'
              }`}
            >
              <span className="text-xl">
                {tag === 'Épicé' && '🌶️'}
                {tag === 'Végétarien' && '🥬'}
                {tag === 'Halal' && '🥩'}
                {tag === 'Sucré' && '🍯'}
              </span>
              <span className="font-medium">{tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductGrid = () => {
  const { category, setCategory } = useFilterStore();
  const { addItem } = useCartStore();
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const itemsPerPage = 6;

  const products = productsData.products;
  const filteredProducts = products.filter(product => 
    (category === 'Tout' || product.category === category) &&
    (product.price >= priceRange[0] && product.price <= priceRange[1]) &&
    (selectedTags.length === 0 || product.tags.some(tag => selectedTags.includes(tag)))
  );

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar 
            category={category}
            setCategory={setCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            products={products}
          />

          {/* Grille de produits */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 rounded-xl border border-[#1a472a]/20 text-[#1a472a] disabled:opacity-50 hover:bg-[#1a472a]/5 transition-colors"
              >
                Précédent
              </button>
              {[...Array(pageCount)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-5 py-2.5 rounded-xl border ${
                    page === i + 1 
                      ? 'bg-[#1a472a] text-white border-[#1a472a]' 
                      : 'border-[#1a472a]/20 text-[#1a472a] hover:bg-[#1a472a]/5'
                  } transition-colors`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="px-5 py-2.5 rounded-xl border border-[#1a472a]/20 text-[#1a472a] disabled:opacity-50 hover:bg-[#1a472a]/5 transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;