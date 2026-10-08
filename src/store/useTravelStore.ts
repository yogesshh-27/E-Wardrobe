import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Trip, PackingListItem } from '@/types';

interface TravelState {
  currentTrip: Trip | null;
  savedTrips: Trip[];

  // Actions
  setCurrentTrip: (trip: Trip | null) => void;
  saveTrip: (trip: Trip) => void;
  togglePackingItem: (itemId: string) => void;
  addPackingItem: (name: string, category: PackingListItem['category']) => void;
  removePackingItem: (itemId: string) => void;
}

export const useTravelStore = create<TravelState>()(
  persist(
    (set) => ({
      currentTrip: null,
      savedTrips: [],

      setCurrentTrip: (trip) => set({ currentTrip: trip }),

      saveTrip: (trip) => {
        set((state) => {
          const exists = state.savedTrips.some((t) => t.id === trip.id);
          return {
            currentTrip: trip,
            savedTrips: exists
              ? state.savedTrips.map((t) => (t.id === trip.id ? trip : t))
              : [trip, ...state.savedTrips],
          };
        });
      },

      togglePackingItem: (itemId) => {
        set((state) => {
          if (!state.currentTrip) return state;
          const updatedPacking = state.currentTrip.packingList.map((item) =>
            item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
          );
          const updatedTrip = { ...state.currentTrip, packingList: updatedPacking };
          return {
            currentTrip: updatedTrip,
            savedTrips: state.savedTrips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)),
          };
        });
      },

      addPackingItem: (name, category) => {
        set((state) => {
          if (!state.currentTrip) return state;
          const newItem: PackingListItem = {
            id: `pack-custom-${Date.now()}`,
            name,
            category,
            isPacked: false,
            quantity: 1,
          };
          const updatedTrip = {
            ...state.currentTrip,
            packingList: [...state.currentTrip.packingList, newItem],
          };
          return {
            currentTrip: updatedTrip,
            savedTrips: state.savedTrips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)),
          };
        });
      },

      removePackingItem: (itemId) => {
        set((state) => {
          if (!state.currentTrip) return state;
          const updatedTrip = {
            ...state.currentTrip,
            packingList: state.currentTrip.packingList.filter((item) => item.id !== itemId),
          };
          return {
            currentTrip: updatedTrip,
            savedTrips: state.savedTrips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)),
          };
        });
      },
    }),
    {
      name: 'ewardrobe_travel_store',
    }
  )
);
