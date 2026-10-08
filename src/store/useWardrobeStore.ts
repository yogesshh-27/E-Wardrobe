import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WardrobeItem, WardrobeFolder, ClothingCategory } from '@/types';
import { DEFAULT_FOLDERS } from '@/data/defaultFolders';
import { MOCK_WARDROBE_ITEMS } from '@/data/mockWardrobe';

interface WardrobeFilterState {
  searchQuery: string;
  category?: ClothingCategory | 'All';
  color?: string;
  style?: string;
  season?: string;
  occasion?: string;
  formality?: string;
  onlyFavorites: boolean;
  activeFolderId: string | 'all';
  viewMode: 'grid' | 'list';
}

interface WardrobeState {
  items: WardrobeItem[];
  folders: WardrobeFolder[];
  filters: WardrobeFilterState;
  selectedItem: WardrobeItem | null;

  // Actions
  addItem: (item: Omit<WardrobeItem, 'id' | 'createdAt'>) => WardrobeItem;
  updateItem: (id: string, updates: Partial<WardrobeItem>) => void;
  deleteItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  moveItemToFolder: (itemId: string, targetFolderId: string) => void;
  setSelectedItem: (item: WardrobeItem | null) => void;

  // Folder Actions
  createFolder: (name: string, category?: string) => WardrobeFolder;
  renameFolder: (id: string, newName: string) => void;
  deleteFolder: (id: string) => void;

  // Filter Actions
  setFilters: (updates: Partial<WardrobeFilterState>) => void;
  resetFilters: () => void;

  // Demo / Seed Actions
  loadDemoWardrobe: () => void;
  resetWardrobe: () => void;
}

const initialFilters: WardrobeFilterState = {
  searchQuery: '',
  category: 'All',
  onlyFavorites: false,
  activeFolderId: 'all',
  viewMode: 'grid',
};

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set, get) => ({
      items: MOCK_WARDROBE_ITEMS, // Start pre-seeded with demo items per Section 19
      folders: DEFAULT_FOLDERS.map((f) => ({ ...f, userId: 'user-default' })),
      filters: initialFilters,
      selectedItem: null,

      addItem: (itemData) => {
        const newItem: WardrobeItem = {
          ...itemData,
          id: `w-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ items: [newItem, ...state.items] }));
        return newItem;
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
          selectedItem:
            state.selectedItem?.id === id ? { ...state.selectedItem, ...updates } : state.selectedItem,
        }));
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
        }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, favorite: !item.favorite } : item
          ),
          selectedItem:
            state.selectedItem?.id === id
              ? { ...state.selectedItem, favorite: !state.selectedItem.favorite }
              : state.selectedItem,
        }));
      },

      moveItemToFolder: (itemId, targetFolderId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, folderId: targetFolderId } : item
          ),
        }));
      },

      setSelectedItem: (item) => set({ selectedItem: item }),

      createFolder: (name, category) => {
        const newFolder: WardrobeFolder = {
          id: `f-${Date.now()}`,
          userId: 'user-default',
          name,
          category,
          isDefault: false,
        };
        set((state) => ({ folders: [...state.folders, newFolder] }));
        return newFolder;
      },

      renameFolder: (id, newName) => {
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, name: newName } : f)),
        }));
      },

      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          // Move items from deleted folder to default "Other" folder
          items: state.items.map((i) => (i.folderId === id ? { ...i, folderId: 'f-other' } : i)),
          filters:
            state.filters.activeFolderId === id
              ? { ...state.filters, activeFolderId: 'all' }
              : state.filters,
        }));
      },

      setFilters: (updates) => {
        set((state) => ({ filters: { ...state.filters, ...updates } }));
      },

      resetFilters: () => {
        set({ filters: initialFilters });
      },

      loadDemoWardrobe: () => {
        set({
          items: MOCK_WARDROBE_ITEMS,
          folders: DEFAULT_FOLDERS.map((f) => ({ ...f, userId: 'user-default' })),
          filters: initialFilters,
        });
      },

      resetWardrobe: () => {
        set({
          items: [],
          folders: DEFAULT_FOLDERS.map((f) => ({ ...f, userId: 'user-default' })),
          filters: initialFilters,
          selectedItem: null,
        });
      },
    }),
    {
      name: 'ewardrobe_wardrobe_store',
    }
  )
);
