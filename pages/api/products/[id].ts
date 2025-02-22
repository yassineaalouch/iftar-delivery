import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const productsFile = path.join(process.cwd(), 'data', 'products.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const data = await fs.readFile(productsFile, 'utf-8');
    const { products } = JSON.parse(data);

    switch (req.method) {
      case 'GET':
        const product = products.find((p: any) => p.id === id);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json(product);

      case 'PUT':
        const productIndex = products.findIndex((p: any) => p.id === id);
        if (productIndex === -1) {
          return res.status(404).json({ error: 'Product not found' });
        }
        const updatedProduct = {
          ...products[productIndex],
          ...req.body,
          id: products[productIndex].id // Prevent ID modification
        };
        products[productIndex] = updatedProduct;
        await fs.writeFile(productsFile, JSON.stringify({ products }, null, 2));
        return res.status(200).json(updatedProduct);

      case 'DELETE':
        const filteredProducts = products.filter((p: any) => p.id !== id);
        await fs.writeFile(productsFile, JSON.stringify({ products: filteredProducts }, null, 2));
        return res.status(200).json({ message: 'Product deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 