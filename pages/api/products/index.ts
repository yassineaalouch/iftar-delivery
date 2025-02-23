import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const productsFile = path.join(process.cwd(), 'data', 'products.json');

interface Product {
  id: string;
  name: string;
  fournisseur: string;
  prixUnitaire: number;
  rating: number;
  commentaire: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ensure products file exists with correct structure
    try {
      await fs.access(productsFile);
    } catch {
      await fs.writeFile(productsFile, JSON.stringify({ products: [] }));
    }

    const data = await fs.readFile(productsFile, 'utf-8');
    const { products } = JSON.parse(data);

    switch (req.method) {
      case 'GET':
        return res.status(200).json({ products });

      case 'POST':
        const newProduct: Product = {
          id: `prod_${Date.now()}`,
          name: req.body.name,
          fournisseur: req.body.fournisseur,
          prixUnitaire: Number(req.body.prixUnitaire),
          rating: Number(req.body.rating),
          commentaire: req.body.commentaire,
          image: req.body.image,
          price: Number(req.body.price),
          category: req.body.category,
          tags: req.body.tags || []
        };

        // Validate required fields
        if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        products.push(newProduct);
        await fs.writeFile(productsFile, JSON.stringify({ products }, null, 2));
        return res.status(201).json(newProduct);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 