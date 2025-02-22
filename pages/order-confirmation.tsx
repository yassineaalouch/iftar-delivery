import { NextPage } from 'next';
import { useRouter } from 'next/router';

const OrderConfirmation: NextPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a472a]/10 py-20">
      <div className="container mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-playfair font-bold text-[#1a472a] mb-4">
            Order Confirmed!
          </h1>
          <p className="text-[#2c5545] mb-8">
            Thank you for your order. We will deliver your iftar at your specified time.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#1a472a] text-white px-8 py-3 rounded-xl font-bold"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 