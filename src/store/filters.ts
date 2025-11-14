import { create } from "zustand";

interface FiltersState {
  selectedMealTypeId: number | null;
  selectedTagId: number | null;
  setMealTypeId: (id: number | null) => void;
  setTagId: (id: number | null) => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  selectedMealTypeId: 1,
  selectedTagId: null,
  setMealTypeId: (id) =>
    set(() => ({
      selectedMealTypeId: id,
      selectedTagId: null,
    })),
  setTagId: (id) =>
    set(() => ({
      selectedTagId: id,
      selectedMealTypeId: null,
    })),
}));
