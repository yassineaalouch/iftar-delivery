import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { packageOptions } from '@/data/packageOptions';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isPackage?: boolean;
  packageItems?: {
    id: string;
    name: string;
    quantity: number;
  }[];
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  addPackage: (packageItems: CartItem[], packagePrice: number, packageName: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updatePackageItem: (packageId: string, itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  totalPrice: number;
  updatePackageQuantity: (packageId: string, quantity: number) => void;
  getPackageDiscount: (packageId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,

      addPackage: (packageItems, packagePrice, packageName) => set((state) => {
        const packageId = `package_${Date.now()}`;
        const newPackage: CartItem = {
          id: packageId,
          name: packageName,
          price: packagePrice,
          quantity: 1,
          image: packageItems[0].image, // Using first item's image or could be a package image
          isPackage: true,
          packageItems: packageItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity
          }))
        };
        
        return {
          items: [...state.items, newPackage],
          totalPrice: state.totalPrice + packagePrice
        };
      }),

      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            totalPrice: state.totalPrice + item.price,
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }], totalPrice: state.totalPrice + item.price };
      }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          totalPrice: state.totalPrice - (state.items.find(i => i.id === id)?.price ?? 0)*(state.items.find(i => i.id === id)?.quantity ?? 0),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => {
          // Find the existing item in the current state
          const existingItem = state.items.find(item => item.id === id);
          
          // If item not found, return state unchanged
          if (!existingItem) return state;
      
          // Calculate price change based on the existing item's price
          const priceChange = existingItem.price * (quantity - existingItem.quantity);
      
          return {
            items: state.items.map(item =>
              item.id === id ? { ...item, quantity } : item
            ),
            totalPrice: state.totalPrice + priceChange,
          };
        }),
      clearCart: () => set({ items: [], totalPrice: 0 }),
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      updatePackageQuantity: (packageId: string, quantity: number) => set((state) => {
        const item = state.items.find(i => i.id === packageId);
        if (!item?.isPackage) return state;

        const oldTotal = item.price * item.quantity;
        const newTotal = item.price * quantity;

        return {
          items: state.items.map(i => 
            i.id === packageId ? { ...i, quantity } : i
          ),
          totalPrice: state.totalPrice - oldTotal + newTotal
        };
      }),
      updatePackageItem: (packageId: string, itemId: string, quantity: number) => set((state) => {
        const pkg = state.items.find(i => i.id === packageId && i.isPackage);
        if (!pkg?.packageItems) return state;
        
        const updatedPackageItems = pkg.packageItems.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        );
        
        // Recalculate package price based on new quantities
        const newPrice = updatedPackageItems.reduce((sum, item) => {
          const baseItem = packageOptions.flatMap(cat => cat.options)
            .find(opt => opt.id === item.id);
          return sum + (baseItem?.price || 0) * item.quantity;
        }, 0);
        
        return {
          items: state.items.map(i => 
            i.id === packageId 
              ? { 
                  ...i, 
                  packageItems: updatedPackageItems,
                  price: newPrice 
                } 
              : i
          ),
          totalPrice: state.totalPrice + (newPrice - pkg.price)
        };
      }),
      getPackageDiscount: (packageId: string) => {
        const state = get();
        const pkg = state.items.find(i => i.id === packageId && i.isPackage);
        if (!pkg) return 0;
        
        const itemsTotal = pkg.packageItems?.reduce((sum, item) => {
          const baseItem = packageOptions.flatMap(cat => cat.options)
            .find(opt => opt.id === item.id);
          return sum + ((baseItem?.price || 0) * item.quantity);
        }, 0) || 0;

        return itemsTotal - pkg.price;
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => ({
        getItem: (...args) => {
          return typeof window !== 'undefined' 
            ? localStorage.getItem(...args) 
            : null;
        },
        setItem: (...args) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(...args);
          }
        },
        removeItem: (...args) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(...args);
          }
        },
      })),
      skipHydration: true,
    }
  )
); 