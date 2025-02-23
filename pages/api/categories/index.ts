import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const categoriesFile = path.join(process.cwd(), 'data', 'categories.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ensure file exists
    try {
      await fs.access(categoriesFile);
    } catch {
      await fs.writeFile(categoriesFile, JSON.stringify({ categories: [] }));
    }

    const data = await fs.readFile(categoriesFile, 'utf-8');
    const { categories } = JSON.parse(data);

    switch (req.method) {
      case 'GET':
        return res.status(200).json({ categories });

      case 'POST':
        const newCategory = req.body.category;
        if (!categories.includes(newCategory)) {
          categories.push(newCategory);
          await fs.writeFile(categoriesFile, JSON.stringify({ categories }, null, 2));
        }
        return res.status(201).json({ categories });

      case 'DELETE':
        const categoryToDelete = req.body.category;
        const updatedCategories = categories.filter((c: string) => c !== categoryToDelete);
        await fs.writeFile(categoriesFile, JSON.stringify({ categories: updatedCategories }, null, 2));
        return res.status(200).json({ categories: updatedCategories });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 