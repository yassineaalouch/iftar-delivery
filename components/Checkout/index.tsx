import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCartStore } from '@/store/useCartStore';
import LoadingSpinner from '../LoadingSpinner';
import { deliverySlots } from '@/data/deliverySlots';
import { getDeliveryFee, isOrderingAllowed } from '@/utils/timeUtils';
import Toast from '../Toast';
import CountdownTimer from '../CountdownTimer';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliverySlot: string;
}

const Checkout = () => {
  const router = useRouter();
  const { items, clearCart, totalPrice } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliverySlot: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const now = new Date();
    if (!isOrderingAllowed(now)) {
      setError('Orders are currently closed. Please order between 8 AM and 3 PM.');
      setIsLoading(false);
      return;
    }

    const deliveryFee = getDeliveryFee(now);
    if (deliveryFee === null) {
      setError('Invalid ordering time');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo,
          items,
          totalPrice: totalPrice + deliveryFee,
          deliveryFee,
          orderDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        clearCart();
        router.push('/order-confirmation');
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-playfair font-bold text-[#1a472a] text-center mb-8">
          Checkout
        </h1>

        <div className="mb-6">
          <CountdownTimer startHour={8} endHour={15} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-[#1a472a]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-xl font-medium">Delivery Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex gap-2 text-sm font-medium text-gray-700 mb-1">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-[#1a472a]/20 
                           focus:border-[#1a472a] outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="flex gap-2 text-sm font-medium text-gray-700 mb-1">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-[#1a472a]/20 
                           focus:border-[#1a472a] outline-none transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="flex gap-2 text-sm font-medium text-gray-700 mb-1">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-[#1a472a]/20 
                           focus:border-[#1a472a] outline-none transition-all"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[#1a472a] font-medium">Select Delivery Time</label>
                <div className="grid grid-cols-3 gap-4">
                  {deliverySlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, deliverySlot: slot.time })}
                      className={`p-4 rounded-xl border-2 transition-all duration-300
                        ${customerInfo.deliverySlot === slot.time
                          ? 'border-[#1a472a] bg-[#1a472a]/5 text-[#1a472a]'
                          : 'border-gray-200 hover:border-[#1a472a]/50'
                        }`}
                    >
                      <span className="block text-lg font-medium">{slot.label}</span>
                      <span className="block text-sm text-gray-500 mt-1">Today</span>
                    </button>
                  ))}
                </div>
                {!customerInfo.deliverySlot && (
                  <p className="text-sm text-amber-600">Please select a delivery time</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="flex gap-2 text-sm font-medium text-gray-700 mb-1">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Delivery Address
                </label>
                <textarea
                  required
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-[#1a472a]/20 
                           focus:border-[#1a472a] outline-none transition-all"
                  rows={3}
                  placeholder="Enter your delivery address"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee:</span>
                  <span>${(getDeliveryFee(new Date()) || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-medium text-[#1a472a] pt-2 border-t">
                  <span>Total Amount:</span>
                  <span>${(totalPrice + (getDeliveryFee(new Date()) || 0)).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a472a] text-white py-3 rounded-xl font-bold
                         transition-all duration-300 hover:bg-[#2c5545] 
                         transform hover:scale-105 disabled:opacity-50
                         disabled:cursor-not-allowed disabled:transform-none
                         flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M5 13l4 4L19 7" />
                    </svg>
                    Place Order
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-[#1a472a] mb-2">
            Delivery Fee Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-32">8 AM - 1 PM:</span>
              <span className="font-medium">10 MAD</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-32">1 PM - 3 PM:</span>
              <span className="font-medium">15 MAD</span>
            </li>
            <li className="flex items-center gap-2 text-amber-600">
              <span className="w-32">After 3 PM:</span>
              <span className="font-medium">Orders Closed</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 