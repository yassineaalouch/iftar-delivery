import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';
import CartSidebar from '../CartSidebar';
//import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { items } = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartCount = items.length;

  return (
    <>
      <header className="fixed w-full bg-transparent backdrop-blur-sm z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-playfair font-bold text-white">
            Iftar Delivery
          </div>
          <div className="flex items-center gap-6">
            <div 
              className="relative cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <button className="bg-white/20 text-white px-6 py-2 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm">
              Order Now
            </button>
          </div>
        </nav>
      </header>
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Navbar;