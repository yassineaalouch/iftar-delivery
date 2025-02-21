import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/router';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryTime: string;
}

const Checkout = () => {
  const [isClient, setIsClient] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryTime: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsClient(true);
    // Set initial time in UTC to avoid timezone issues
    setCustomerInfo(prev => ({
      ...prev,
      deliveryTime: new Date().toLocaleString('en-US', { 
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+)/, '$3-$1-$2T$4:$5')
    }));
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const order = {
      customerInfo,
      items,
      totalPrice: getTotalPrice(),
      orderDate: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      clearCart();
      router.push('/order-confirmation');
    } catch (error) {
      setError('Failed to place order. Please try again.');
      console.error('Error placing order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a472a]/10 py-20">
      <div className="container mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8">
          <h2 className="text-3xl font-playfair font-bold text-[#1a472a] mb-8">
            Checkout
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#2c5545] mb-2">
                Name
              </label>
              <input
                type="text"
                required
                value={customerInfo.name}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-[#1a472a]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c5545] mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-[#1a472a]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c5545] mb-2">
                Phone
              </label>
              <input
                type="tel"
                required
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-[#1a472a]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c5545] mb-2">
                Delivery Address
              </label>
              <textarea
                required
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, address: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-[#1a472a]/20"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c5545] mb-2">
                Preferred Delivery Time
              </label>
              <input
                type="datetime-local"
                required
                value={customerInfo.deliveryTime}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, deliveryTime: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-[#1a472a]/20"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#1a472a] text-white px-8 py-4 rounded-xl font-bold
                         ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 