import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const tagsFile = path.join(process.cwd(), 'data', 'tags.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ensure file exists
    try {
      await fs.access(tagsFile);
    } catch {
      await fs.writeFile(tagsFile, JSON.stringify({ tags: [] }));
    }

    const data = await fs.readFile(tagsFile, 'utf-8');
    const { tags } = JSON.parse(data);

    switch (req.method) {
      case 'GET':
        return res.status(200).json({ tags });

      case 'POST':
        const newTag = req.body.tag;
        if (!tags.includes(newTag)) {
          tags.push(newTag);
          await fs.writeFile(tagsFile, JSON.stringify({ tags }, null, 2));
        }
        return res.status(201).json({ tags });

      case 'DELETE':
        const tagToDelete = req.body.tag;
        const updatedTags = tags.filter((t: string) => t !== tagToDelete);
        await fs.writeFile(tagsFile, JSON.stringify({ tags: updatedTags }, null, 2));
        return res.status(200).json({ tags: updatedTags });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 