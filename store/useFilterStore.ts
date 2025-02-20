import { create } from 'zustand';

interface FilterState {
  category: string;
  setCategory: (category: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  category: 'All',
  setCategory: (category) => set({ category }),
})); 