import Checkout from '@/components/Checkout';

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <Checkout />
    </div>
  );
} 