import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');

interface Order {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ensure orders file exists with correct structure
    try {
      await fs.access(ordersFile);
    } catch {
      await fs.writeFile(ordersFile, JSON.stringify({ orders: [] }));
    }

    const data = await fs.readFile(ordersFile, 'utf-8');
    const { orders } = JSON.parse(data);

    switch (req.method) {
      case 'GET':
        return res.status(200).json({ orders });

      case 'POST':
        const order :Order = req.body;
        const newOrder = {
            id: `order_${Date.now()}`,
            ...order,
            status: 'pending'
          };
        

        // Validate required fields

        orders.push(newOrder);
        await fs.writeFile(ordersFile, JSON.stringify({ orders }, null, 2));
        return res.status(201).json(newOrder);
        

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 