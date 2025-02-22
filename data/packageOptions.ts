export interface PackageOption {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface Category {
  name: string;
  options: PackageOption[];
}

export const packageOptions: Category[] = [
  {
    name: 'Drinks',
    options: [
      { id: 'tea', name: 'Moroccan Tea', price: 2, image: '/images/products/tea.jpeg' },
      { id: 'coffee', name: 'Coffee', price: 2, image: '/images/products/coffee.jpeg' }
    ]
  },
  {
    name: 'Soup',
    options: [
      { id: 'hrira', name: 'Hrira', price: 3, image: '/images/products/hrira.jpeg' },
      { id: 'hsoua', name: 'Hsoua', price: 3, image: '/images/products/hsoua.jpeg' }
    ]
  },
  {
    name: 'Baked',
    options: [
      { id: 'msemen', name: 'Msemen', price: 2, image: '/images/products/msemen.jpeg' },
      { id: 'beghrir', name: 'Beghrir', price: 2, image: '/images/products/beghrir.jpeg' }
    ]
  },
  {
    name: 'Sweet',
    options: [
      { id: 'chebakia', name: 'Chebakia', price: 1, image: '/images/products/chebakia.jpeg' },
      { id: 'briwat', name: 'Briwat', price: 1, image: '/images/products/briwat.jpeg' }
    ]
  }
]; 