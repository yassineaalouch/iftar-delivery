import { useState } from 'react';
import Image from 'next/image';
import productsData from '@/data/products.json';

const ProductGrid = () => {
  const [category, setCategory] = useState('All');
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-lg mb-4 text-primary">Filters</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="All">All Categories</option>
                <option value="Traditional">Traditional</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Sweets">Sweets</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-20 px-2 py-1 border rounded"
                  min="0"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-20 px-2 py-1 border rounded"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="space-y-2">
                {Array.from(new Set(products.flatMap(p => p.tags))).map(tag => (
                  <label key={tag} className="flex items-center gap-2">
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
                      className="rounded text-primary"
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="relative h-40">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium mb-2 text-[#0f2b1a]">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-[#0f2b1a]">${product.price}</span>
                      <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                        Add to Cart
                      </button>
                    </div>
                    <div className="mt-2 flex gap-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-[#0f2b1a] px-2 py-1 rounded text-white">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(pageCount)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg border ${
                    page === i + 1 ? 'bg-primary text-[#0f2b1a]' : ''
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="px-4 py-2 rounded-lg border disabled:opacity-50"
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