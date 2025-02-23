import { useState, useEffect } from 'react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: () => void;
}

interface Product {
  id: string;
  name: string;
  prixUnitaire: number,
  fournisseur: string,
  rating: number,
  commentaire:string,
  price: number;
  image: string;
  category: string;
  tags: string[];
}

const ProductModal = ({ isOpen, onClose, product, onSave }: ProductModalProps) => {

const [formData, setFormData] = useState({
    name: '',
    prixUnitaire: 0,
    fournisseur: '',
    rating: 0,
    commentaire:'',
    price: 0,
    image: '',
    category: '',
    tags: [] as string[]
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/tags')
        ]);
        const categoriesData = await categoriesRes.json();
        const tagsData = await tagsRes.json();
        setCategories(categoriesData.categories);
        setAvailableTags(tagsData.tags);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({prixUnitaire: 0,fournisseur: '',rating: 0,
        commentaire:'', name: '', price: 0, image: '', category: '', tags: [] });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: newCategory }),
        });
        const data = await res.json();
        setCategories(data.categories);
        setFormData({ ...formData, category: newCategory });
        setNewCategory('');
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (confirm(`Are you sure you want to delete "${category}" category?`)) {
      try {
        const res = await fetch('/api/categories', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category }),
        });
        const data = await res.json();
        setCategories(data.categories);
        if (formData.category === category) {
          setFormData({ ...formData, category: '' });
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleAddTag = async () => {
    if (newTag && !availableTags.includes(newTag)) {
      try {
        const res = await fetch('/api/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tag: newTag }),
        });
        const data = await res.json();
        setAvailableTags(data.tags);
        setNewTag('');
      } catch (error) {
        console.error('Error adding tag:', error);
      }
    }
  };

  const handleDeleteTag = async (tag: string) => {
    if (confirm(`Are you sure you want to delete "${tag}" tag?`)) {
      try {
        const res = await fetch('/api/tags', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tag }),
        });
        const data = await res.json();
        setAvailableTags(data.tags);
        setFormData({
          ...formData,
          tags: formData.tags.filter(t => t !== tag)
        });
      } catch (error) {
        console.error('Error deleting tag:', error);
      }
    }
  };

  const toggleTag = (tag: string) => {
    const newTags = formData.tags.includes(tag)
      ? formData.tags.filter(t => t !== tag)
      : [...formData.tags, tag];
    setFormData({ ...formData, tags: newTags });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-5xl m-4">
        <h2 className="text-2xl font-bold mb-4">
          {product ? 'Edit Product' : 'Add Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fournisseur</label>
              <input
                type="text"
                value={formData.fournisseur}
                onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })}
                className="w-full rounded-lg border p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full rounded-lg border p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prix Unitaire</label>
              <input
                type="number"
                value={formData.prixUnitaire}
                onChange={(e) => setFormData({ ...formData, prixUnitaire: Number(e.target.value) })}
                className="w-full rounded-lg border p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full rounded-lg border p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full rounded-lg border p-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Commentaire</label>
            <textarea
              value={formData.commentaire}
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
              className="w-full rounded-lg border p-2 h-24"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[100px] bg-gray-50 p-2 rounded-lg">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
                        ${formData.category === cat
                          ? 'bg-[#1a472a] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {cat}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New Category"
                  className="w-full rounded-lg border p-2"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#2c5545]"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[100px] bg-gray-50 p-2 rounded-lg">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                        ${formData.tags.includes(tag)
                          ? 'bg-[#1a472a] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {tag}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTag(tag)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="New Tag"
                  className="w-full rounded-lg border p-2"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#2c5545]"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#2c5545]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProductModal; 
