import { useRef, useCallback } from "react";
import { useMeals } from "../hooks/useMeals";
import { Meal } from "./Meal";
import type { MealData, MealsResponse } from "../types/meals";
import type { InfiniteData } from "@tanstack/react-query";

export const MealsList = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useMeals();

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
    return <p className="text-center py-8 text-gray-500">Loading meals...</p>;

  if (isError)
    return (
      <p className="text-center py-8 text-red-500">Error: {error.message}</p>
    );

  if (!isLoading && meals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No meals</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-center">
        {meals.map((meal: MealData, index: number) => {
          const isLast = index === meals.length - 1;
          return (
            <div key={meal.id} ref={isLast ? lastMealRef : null}>
              <Meal
                meal_id={meal.meal_id}
                meal_type={meal.meal_type}
                name={meal.name}
                image={meal.image?.url || null}
              />
            </div>
          );
        })}
      </div>

      {isFetchingNextPage && (
        <p className="text-center mt-4 text-gray-500">Loading more...</p>
      )}
    </div>
  );
};
