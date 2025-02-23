import { useState, useEffect } from 'react';
import OrderModal from './OrderModal';

interface Order {
  id: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    deliverySlot: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  orderDate: string;
} 

type SortField = 'date' | 'total' | 'customer' | 'status';
type SortOrder = 'asc' | 'desc';

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      console.log(data.orders);
      if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        console.error('Unexpected data format:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const sortOrders = (orders: Order[]) => {
    return orders.sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      
      switch (sortField) {
        case 'date':
          return multiplier * (new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        case 'total':
          return multiplier * (a.totalPrice - b.totalPrice);
        case 'customer':
          return multiplier * a.customerInfo.name.localeCompare(b.customerInfo.name);
        case 'status':
          return multiplier * a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  };

  const filteredOrders = sortOrders(
    orders.filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const orderDate = new Date(order.orderDate);
      const matchesStartDate = !startDate || orderDate >= new Date(startDate);
      const matchesEndDate = !endDate || orderDate <= new Date(endDate);
      const matchesSearch = searchQuery === '' || 
        order.customerInfo.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesStartDate && matchesEndDate && matchesSearch;
    })
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1a472a]">Orders</h2>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Search Customer</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="rounded-lg border p-2 text-sm w-64"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
              className="rounded-lg border p-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('customer')}
              >
                Customer {getSortIcon('customer')}
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('total')}
              >
                Total {getSortIcon('total')}
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('date')}
              >
                Date {getSortIcon('date')}
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{order.customerInfo.name}</div>
                    <div className="text-sm text-gray-500">{order.customerInfo.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                    className={`rounded-lg px-2 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrdersTable; 