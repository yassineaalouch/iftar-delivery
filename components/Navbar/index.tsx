import { useState, useEffect } from 'react';
//import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Get cart count from localStorage
    const cart = localStorage.getItem('cart');
    if (cart) {
      setCartCount(JSON.parse(cart).length);
    }
  }, []);

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-md z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-playfair font-bold text-primary">
          IftarEase
        </div>
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer">
            <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
            
          </div>
          <button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors">
            Order Now
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 