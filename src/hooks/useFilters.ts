import { useFiltersStore } from "../store/filters";

export const useFilters = () => {
  const selectedMealTypeId = useFiltersStore(
    (state) => state.selectedMealTypeId
  );
  const selectedTagId = useFiltersStore((state) => state.selectedTagId);
  const setMealTypeId = useFiltersStore((state) => state.setMealTypeId);
  const setTagId = useFiltersStore((state) => state.setTagId);

  return { selectedMealTypeId, selectedTagId, setMealTypeId, setTagId };
};
