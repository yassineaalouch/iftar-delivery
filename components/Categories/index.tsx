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
    // Staggered animation on load
    const cards = document.querySelectorAll('.category-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-pulse-scale');
      }, index * 200);
    });
  }, []);

  return (
    <section className="py-16 bg-white rounded-b-[20%]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-playfair text-center mb-12 text-neutral">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto overflow-x-auto md:overflow-visible">
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
      className="category-card bg-white p-4 rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={() => setCategory(category.filterValue)}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-4xl mb-2">{category.icon}</div>
        <h3 className="text-lg font-semibold text-center text-neutral">{category.title}</h3>
        <p className="text-sm text-center text-neutral/70">{category.description}</p>
      </div>
    </div>
  );
}