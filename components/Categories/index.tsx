import { useEffect } from 'react';

const categories = [
  {
    id: 'traditional',
    title: 'Traditional Meals',
    icon: '🍲',
    description: 'Authentic iftar dishes'
  },
  {
    id: 'boulangerie',
    title: 'Boulangerie',
    icon: '🥖',
    description: 'Fresh baked goods'
  },
  {
    id: 'fast-food',
    title: 'Fast Food',
    icon: '🍔',
    description: 'Quick meal options'
  },
  {
    id: 'sweets',
    title: 'Drinks & Sweets',
    icon: '🍯',
    description: 'Traditional desserts'
  }
];

const Categories = () => {
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-playfair text-center mb-12 text-neutral">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto overflow-x-auto md:overflow-visible">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card min-w-[160px] text-center"
            >
              <span className="text-4xl mb-2">{category.icon}</span>
              <h3 className="font-medium mb-1">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories; 