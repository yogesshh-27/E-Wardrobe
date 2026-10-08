import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Outfit } from '@/types';

interface OutfitState {
  generatedOutfits: Outfit[];
  savedOutfits: Outfit[];
  activeOutfitForTryOn: Outfit | null;
  isTryOnModalOpen: boolean;

  // Actions
  setGeneratedOutfits: (outfits: Outfit[]) => void;
  saveOutfit: (outfit: Outfit) => void;
  unsaveOutfit: (outfitId: string) => void;
  toggleOutfitFavorite: (outfitId: string) => void;
  deleteOutfit: (outfitId: string) => void;
  openTryOn: (outfit: Outfit) => void;
  closeTryOn: () => void;
}

export const useOutfitStore = create<OutfitState>()(
  persist(
    (set) => ({
      generatedOutfits: [],
      savedOutfits: [],
      activeOutfitForTryOn: null,
      isTryOnModalOpen: false,

      setGeneratedOutfits: (outfits) => set({ generatedOutfits: outfits }),

      saveOutfit: (outfit) => {
        set((state) => {
          const exists = state.savedOutfits.some((o) => o.id === outfit.id);
          const updatedOutfit = { ...outfit, saved: true };
          return {
            savedOutfits: exists
              ? state.savedOutfits.map((o) => (o.id === outfit.id ? updatedOutfit : o))
              : [updatedOutfit, ...state.savedOutfits],
            generatedOutfits: state.generatedOutfits.map((o) =>
              o.id === outfit.id ? { ...o, saved: true } : o
            ),
          };
        });
      },

      unsaveOutfit: (outfitId) => {
        set((state) => ({
          savedOutfits: state.savedOutfits.filter((o) => o.id !== outfitId),
          generatedOutfits: state.generatedOutfits.map((o) =>
            o.id === outfitId ? { ...o, saved: false } : o
          ),
        }));
      },

      toggleOutfitFavorite: (outfitId) => {
        set((state) => ({
          savedOutfits: state.savedOutfits.map((o) =>
            o.id === outfitId ? { ...o, favorite: !o.favorite } : o
          ),
          generatedOutfits: state.generatedOutfits.map((o) =>
            o.id === outfitId ? { ...o, favorite: !o.favorite } : o
          ),
        }));
      },

      deleteOutfit: (outfitId) => {
        set((state) => ({
          savedOutfits: state.savedOutfits.filter((o) => o.id !== outfitId),
          generatedOutfits: state.generatedOutfits.filter((o) => o.id !== outfitId),
        }));
      },

      openTryOn: (outfit) => set({ activeOutfitForTryOn: outfit, isTryOnModalOpen: true }),
      closeTryOn: () => set({ activeOutfitForTryOn: null, isTryOnModalOpen: false }),
    }),
    {
      name: 'ewardrobe_outfit_store',
    }
  )
);
