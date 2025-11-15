import { useRef, useCallback, useEffect } from "react";
import { useMeals } from "../hooks/useMeals";
import { Meal } from "./Meal";
import type { MealData, MealsResponse } from "../types/meals";
import type { InfiniteData } from "@tanstack/react-query";
import { useFiltersStore } from "../store/filters";
import { useQueryClient } from "@tanstack/react-query";

export const MealsList = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const queryClient = useQueryClient();

  const selectedMealTypeId = useFiltersStore(
    (state) => state.selectedMealTypeId
  );
  const selectedTagId = useFiltersStore((state) => state.selectedTagId);

  // HOTFIX
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["meals"],
      exact: false,
    });

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [selectedMealTypeId, selectedTagId, queryClient]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useMeals({
    mealTypeId: selectedMealTypeId,
    tagId: selectedTagId,
  });

  const meals =
    (data as InfiniteData<MealsResponse> | undefined)?.pages.flatMap(
      (page: MealsResponse) => page.data
    ) ?? [];

  const lastMealRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  if (isLoading && meals.length === 0)
    return (
      <p className="flex justify-center items-center h-screen text-gray-500">
        Ładowanie posiłków...
      </p>
    );

  if (isError)
    return (
      <p className="flex justify-center items-center h-screen text-red-500">
        Błąd: {error.message}
      </p>
    );

  if (!isLoading && meals.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <p>Brak posiłków</p>
      </div>
    );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mr-4 ml-2">
        {meals.map((meal: MealData, index: number) => {
          const isLast = index === meals.length - 1;
          return (
            <div key={meal.id} ref={isLast ? lastMealRef : null}>
              <Meal
                meal_id={meal.id}
                meal_type={meal.meal_type}
                name={meal.name}
                image={meal.image?.url || null}
                new={meal.new}
              />
            </div>
          );
        })}
      </div>

      {isFetchingNextPage && (
        <p className="flex justify-center mt-4 text-gray-500">
          Ładowanie kolejnych posiłków...
        </p>
      )}
    </div>
  );
};
