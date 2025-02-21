import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const router = useRouter();
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal >= 50 ? 0 : 5.00;
  const tax = subtotal * 0.20;
  const total = subtotal + deliveryFee + tax;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-xl 
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-[#1a472a] text-white">
            <h2 className="text-xl font-playfair font-bold">Your Cart</h2>
            <button onClick={onClose} className="p-2 hover:opacity-70">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Your cart is empty
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white rounded-lg p-3 shadow-sm">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1a472a]">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-red-500 hover:text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary and Checkout */}
          <div className="border-t p-4 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (20%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                router.push('/cart');
              }}
              disabled={items.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-white
                ${items.length === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-[#1a472a] hover:bg-[#2c5545] transform hover:scale-105 transition-all duration-300'
                }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar; 