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

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderModal = ({ isOpen, onClose, order }: OrderModalProps) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Customer Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p><span className="font-medium">Name:</span> {order.customerInfo.name}</p>
              <p><span className="font-medium">Email:</span> {order.customerInfo.email}</p>
              <p><span className="font-medium">Phone:</span> {order.customerInfo.phone}</p>
              <p><span className="font-medium">Address:</span> {order.customerInfo.address}</p>
              <p><span className="font-medium">Delivery Slot:</span> {order.customerInfo.deliverySlot}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Order Items</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Item</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t border-gray-200">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 font-medium text-right">Total:</td>
                    <td className="px-4 py-2 font-medium">${order.totalPrice.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Order Status</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p><span className="font-medium">Status:</span> {order.status}</p>
              <p><span className="font-medium">Order Date:</span> {new Date(order.orderDate).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal; 