import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Toast from '../Toast';
import LoadingSpinner from '../LoadingSpinner';
import CartSummary from '../CartSummary';

const Cart = () => {
  const [isClient, setIsClient] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    updateQuantity(id, quantity);
    showToast('Cart updated', 'success');
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    showToast('Item removed from cart', 'success');
  };

  const handleClearCart = () => {
    clearCart();
    showToast('Cart cleared', 'success');
  };

  if (!isClient) {
    return <LoadingSpinner />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#1a472a]/10 py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-playfair font-bold text-[#1a472a] mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you havent added any items to your cart yet.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#1a472a] text-white px-6 py-3 rounded-xl font-bold
                         hover:bg-[#2c5545] transition-colors duration-300
                         transform hover:scale-105"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a472a]/10 py-20">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-playfair font-bold text-[#1a472a]">
                  Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h2>
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow
                               border border-gray-100 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          fill
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-playfair font-bold text-xl text-[#1a472a] mb-2 group-hover:text-[#2c5545]">
                          {item.name}
                        </h3>
                        <p className="text-[#2c5545] font-bold text-lg mb-4">
                          ${(item.price * item.quantity).toFixed(2)}
                          {item.quantity > 1 && (
                            <span className="text-sm text-gray-500 ml-2">
                              (${item.price.toFixed(2)} each)
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full
                                       bg-[#1a472a]/10 text-[#1a472a] hover:bg-[#1a472a]/20
                                       transition-all duration-300 transform active:scale-90"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full
                                       bg-[#1a472a]/10 text-[#1a472a] hover:bg-[#1a472a]/20
                                       transition-all duration-300 transform active:scale-90"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-600 text-sm font-medium
                                     flex items-center gap-2 transition-all duration-300
                                     transform hover:translate-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#1a472a]">
                      Total: ${getTotalPrice().toFixed(2)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Including all taxes and delivery charges
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/checkout')}
                    className="bg-[#1a472a] text-white px-8 py-4 rounded-xl font-bold
                             hover:bg-[#2c5545] transition-colors duration-300
                             transform hover:scale-105 flex items-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 