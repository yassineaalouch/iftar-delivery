import { useState } from 'react';
import Image from 'next/image';
import productsData from '@/data/products.json';
import { useFilterStore } from '@/store/useFilterStore';
import { useCartStore } from '@/store/useCartStore';

const ProductGrid = () => {
  const { category, setCategory } = useFilterStore();
  const { addItem } = useCartStore();
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const itemsPerPage = 6;

  const products = productsData.products;
  const filteredProducts = products.filter(product => 
    (category === 'All' || product.category === category) &&
    (product.price >= priceRange[0] && product.price <= priceRange[1]) &&
    (selectedTags.length === 0 || product.tags.some(tag => selectedTags.includes(tag)))
  );

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <section className="py-16 bg-[#CECE5A]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50">
            <h3 className="font-playfair text-2xl mb-6 text-[#1a472a] font-bold">Filters</h3>
            
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3 text-[#2c5545]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#1a472a]/20 focus:border-[#1a472a] focus:ring-2 focus:ring-[#1a472a]/20 bg-white/50 backdrop-blur-sm"
              >
                <option value="All">All Categories</option>
                <option value="Traditional">Traditional</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Sweets">Sweets</option>
              </select>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3 text-[#2c5545]">Price Range</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-24 px-3 py-2 border border-[#1a472a]/20 rounded-lg bg-white/50"
                  min="0"
                />
                <span className="text-[#2c5545]">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-24 px-3 py-2 border border-[#1a472a]/20 rounded-lg bg-white/50"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3 text-[#2c5545]">Tags</label>
              <div className="space-y-3">
                {Array.from(new Set(products.flatMap(p => p.tags))).map(tag => (
                  <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags([...selectedTags, tag]);
                        } else {
                          setSelectedTags(selectedTags.filter(t => t !== tag));
                        }
                      }}
                      className="rounded text-[#1a472a] border-[#1a472a]/20"
                    />
                    <span className="text-[#2c5545] group-hover:text-[#1a472a] transition-colors">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <div key={product.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  <div className="relative h-48">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-playfair text-xl font-bold mb-3 text-[#1a472a] group-hover:text-[#2c5545] transition-colors">{product.name}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-[#1a472a]">${product.price}</span>
                      <button 
                        onClick={() => addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image
                        })}
                        className="bg-gradient-to-r from-[#1a472a] to-[#2c5545] text-white px-6 py-3 rounded-xl font-bold tracking-wide transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#1a472a]/30 group"
                      >
                        <span className="flex items-center gap-2">
                          <span>Add to Cart</span>
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1.5 text-sm bg-[#1a472a]/10 text-[#1a472a] px-3 py-1.5 rounded-full">
                          {tag === 'Spicy' && '🌶️'}
                          {tag === 'Vegetarian' && '🥬'}
                          {tag === 'Halal' && '🥩'}
                          {tag === 'Sweet' && '🍯'}
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 rounded-xl border border-[#1a472a]/20 text-[#1a472a] disabled:opacity-50 hover:bg-[#1a472a]/5 transition-colors"
              >
                Previous
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
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;