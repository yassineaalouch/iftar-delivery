import { useCartStore } from '@/store/useCartStore';

const CartSummary = () => {
  const { items, getTotalPrice } = useCartStore();
  const subtotal = getTotalPrice();
  const deliveryFee = 5.00;
  const tax = subtotal * 0.20; // 20% tax

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 sticky top-24 shadow-lg border border-gray-100">
      <h3 className="text-xl font-playfair font-bold text-[#1a472a] mb-6">
        Order Summary
      </h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium">${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (20%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between font-bold">
            <span className="text-[#1a472a]">Total</span>
            <span className="text-[#1a472a]">
              ${(subtotal + deliveryFee + tax).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Delivery within 30-45 minutes
        </p>
        <p className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Free delivery on orders above $50
        </p>
      </div>
    </div>
  );
};

export default CartSummary; 