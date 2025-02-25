import { useEffect } from 'react';
import { useFilterStore } from '../../store/useFilterStore';

const categories = [
  {
    id: 'traditional',
    title: 'Traditional Meals',
    icon: '🍲',
    description: 'Authentic iftar dishes',
    filterValue: 'Traditional'
  },
  {
    id: 'boulangerie', 
    title: 'Boulangerie',
    icon: '🥖',
    description: 'Fresh baked goods',
    filterValue: 'Fast Food'
  },
  {
    id: 'fast-food',
    title: 'Fast Food', 
    icon: '🍔',
    description: 'Quick meal options',
    filterValue: 'Fast Food'
  },
  {
    id: 'sweets',
    title: 'Drinks & Sweets',
    icon: '🍯', 
    description: 'Traditional desserts',
    filterValue: 'Sweets'
  }
];

const Categories = () => {
  const { setCategory } = useFilterStore();

  useEffect(() => {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-pulse-scale');
      }, index * 200);
    });
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl text-center mb-16 font-extrabold">
          <span className="bg-gradient-to-r from-[#ec8b2a] to-[#ec8b2a] bg-clip-text text-transparent">Browse</span>
          <span className="bg-gradient-to-r from-[#ec8b2a] to-black bg-clip-text text-transparent"> Our</span>
          <span className="bg-gradient-to-r from-black to-black bg-clip-text text-transparent"> Categories</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

function CategoryCard({ category }: { category: (typeof categories)[0] }) {
  const { setCategory } = useFilterStore();

  return (
    <div
      className="category-card bg-white text-black rounded-2xl shadow-xl 
                 transition-all duration-500 hover:shadow-2xl 
                 border-2 border-[#78c30a]/50 group cursor-pointer"
      onClick={() => setCategory(category.filterValue)}
    >
      <div className="flex hover:border-[#ec8b2a]/50 flex-col items-center justify-center p-6 transform group-hover:scale-105 transition-all duration-500">
        <div className="text-4xl flex justify-center items-center mb-4
                    w-20 h-20 rounded-full
                    bg-gradient-to-br from-[#78c30a]/10 to-[#ec8b2a]/10
                    border-2 border-[#78c30a]/30
                    shadow-[0_4px_12px_rgba(120,195,42,0.15)]
                    transform group-hover:scale-110 
                    group-hover:rotate-6
                    group-hover:border-[#ec8b2a]/50
                    group-hover:bg-gradient-to-br 
                    group-hover:from-[#78c30a]/20 
                    group-hover:to-[#ec8b2a]/20
                    group-hover:shadow-[0_8px_20px_rgba(236,139,42,0.25)]
                    transition-all duration-500 ease-out">
          {category.icon}
        </div>
        <h3 className="text-xl font-bold text-center text-black font-playfair mb-2 group-hover:text-[#ec8b2a] transition-colors duration-500">
          {category.title}
        </h3>
        <p className="text-sm text-center text-black/70 group-hover:text-black/90 transition-colors duration-500">
          {category.description}
        </p>
      </div>
    </div>
  );
}