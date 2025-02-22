import { useState } from 'react';
import AdminLayout from '@/components/admin/Layout';
import ProductsTable from '@/components/admin/ProductsTable';
import OrdersTable from '@/components/admin/OrdersTable';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors
              ${activeTab === 'products'
                ? 'bg-[#1a472a] text-white'
                : 'bg-gray-100 hover:bg-gray-200'
              }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors
              ${activeTab === 'orders'
                ? 'bg-[#1a472a] text-white'
                : 'bg-gray-100 hover:bg-gray-200'
              }`}
          >
            Orders
          </button>
        </div>

        {activeTab === 'products' ? <ProductsTable /> : <OrdersTable />}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 