import { create } from 'zustand';
import { Ingredient } from '@/ai/tools'; // Import the Ingredient type

// Define the state structure for the cart
interface CartState {
  items: Ingredient[];
  addItem: (item: Ingredient) => void;
  addItems: (items: Ingredient[]) => void;
  removeItem: (itemName: string) => void; // Action to remove an item by name
  clearCart: () => void; // Action to clear all items
}

// Create the Zustand store
export const useCartStore = create<CartState>((set) => ({
  items: [], // Initial state: empty cart

  // Action to add a single item to the cart
  // Basic implementation: just adds the item. Could add logic to merge quantities later.
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),

  // Action to add multiple items to the cart
  addItems: (newItems) => set((state) => {
    // Simple concatenation for now. Could implement merging logic here too.
    // Example: Check if item with same name exists, if so, update quantity.
    // For simplicity, we'll just add all items.
    return { items: [...state.items, ...newItems] };
  }),

  // Action to remove an item by its name (simple implementation, removes all matching)
  removeItem: (itemName) => set((state) => ({
    items: state.items.filter((item) => item.name !== itemName),
  })),

  // Action to clear the entire cart
  clearCart: () => set({ items: [] }),
}));
