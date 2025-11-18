import { useRef, useCallback, useEffect, useMemo } from "react";
import { useMeals } from "../hooks/useMeals";
import { Meal } from "./Meal";
import type { MealData, MealsPage } from "../types/meals";
import type { InfiniteData } from "@tanstack/react-query";
import { useFiltersStore } from "../store/filters";
import { useQueryClient } from "@tanstack/react-query";
import { useSidebar } from "@/hooks/useSidebar";
import type { SidebarTag } from "@/hooks/useSidebar";
import { Skeleton } from "@/components/ui/skeleton";

export const MealsList = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const queryClient = useQueryClient();

  const selectedMealTypeId = useFiltersStore(
    (state) => state.selectedMealTypeId
  );
  const selectedTagId = useFiltersStore((state) => state.selectedTagId);

  const { data: sidebar } = useSidebar();

  const tagsMap = useMemo(() => {
    const map: Record<string, SidebarTag[]> = {};

    sidebar?.forEach((mealType) => {
      map[mealType.name] = mealType.tags;
    });

    return map;
  }, [sidebar]);

  // HOTFIX przy zmianie filtrów
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
    (data as InfiniteData<MealsPage> | undefined)?.pages.flatMap(
      (page: MealsPage) => page.data
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

  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, idx) => (
      <div key={idx}>
        <Skeleton className="w-full aspect-3/5 rounded-md" />
      </div>
    ));
  };

  if (isLoading && meals.length === 0)
    return (
      <div className="grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderSkeletons(6)}
      </div>
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
      <div className="grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                tagsForMealType={tagsMap[meal.meal_type] ?? []}
                rating={meal.rating}
              />
            </div>
          );
        })}

        {isFetchingNextPage && renderSkeletons(6)}
      </div>
    </div>
  );
};
