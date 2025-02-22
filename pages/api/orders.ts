import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const order = req.body;
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
    
    // Read existing orders
    let orders = [];
    if (fs.existsSync(ordersPath)) {
      const ordersData = fs.readFileSync(ordersPath, 'utf8');
      orders = JSON.parse(ordersData);
    }

    // Add new order with ID
    const newOrder = {
      id: `order_${Date.now()}`,
      ...order,
      status: 'pending'
    };
    orders.push(newOrder);

    // Write back to file
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));

    res.status(200).json(newOrder);
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Error saving order' });
  }
} 