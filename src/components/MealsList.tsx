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

  // ✅ Upewniamy się, że TS rozpoznaje strukturę `data`
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

  if (isLoading && meals.length === 0) return <p>Ładowanie posiłków...</p>;
  if (isError) return <p>Błąd: {error.message}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {meals.map((meal: MealData, index: number) => {
          const isLast = index === meals.length - 1;
          return (
            <div key={meal.id} ref={isLast ? lastMealRef : null}>
              <Meal
                meal_type={meal.meal_type}
                name={meal.name}
                image={meal.image?.url || null}
              />
            </div>
          );
        })}
      </div>

      {isFetchingNextPage && (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Ładowanie więcej...
        </p>
      )}
    </div>
  );
};
