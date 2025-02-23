import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const data = await fs.readFile(ordersFile, 'utf-8');
    const { orders } = JSON.parse(data);

    switch (req.method) {
      case 'GET':
        const order = orders.find((o: any) => o.id === id);
        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(200).json(order);

      case 'PUT':
        const orderIndex = orders.findIndex((o: any) => o.id === id);
        if (orderIndex === -1) {
          return res.status(404).json({ error: 'Order not found' });
        }
        const updatedOrder = {
          ...orders[orderIndex],
          ...req.body,
          id: orders[orderIndex].id // Prevent ID modification
        };
        orders[orderIndex] = updatedOrder;
        await fs.writeFile(ordersFile, JSON.stringify({ orders }, null, 2));
        return res.status(200).json(updatedOrder);

      case 'DELETE':
        const filteredOrders = orders.filter((o: any) => o.id !== id);
        await fs.writeFile(ordersFile, JSON.stringify({ orders: filteredOrders }, null, 2));
        return res.status(200).json({ message: 'Order deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 