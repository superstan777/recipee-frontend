import { useRef, useCallback, useEffect, useMemo, useState } from "react";
import { useMeals } from "../hooks/useMeals";
import { Meal } from "./Meal";
import type { MealData, MealsPage } from "../types/meals";
import type { InfiniteData } from "@tanstack/react-query";
import { useFiltersStore } from "../store/filters";
import { useQueryClient } from "@tanstack/react-query";
import { useSidebar } from "@/hooks/useSidebar";
import { useMealStatuses, type MealStatus } from "@/hooks/useMealStatuses";
import type { SidebarTag } from "@/hooks/useSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { MealDialog } from "./MealDialog";

export const MealsList = () => {
  const currentUserId = 1; // temp solution
  const observerRef = useRef<IntersectionObserver | null>(null);
  const queryClient = useQueryClient();
  const [selectedMeal, setSelectedMeal] = useState<MealData | null>(null);

  const selectedMealTypeId = useFiltersStore(
    (state) => state.selectedMealTypeId
  );
  const selectedTagId = useFiltersStore((state) => state.selectedTagId);

  const { data: sidebar } = useSidebar(currentUserId);

  const tagsMap = useMemo(() => {
    const map: Record<string, SidebarTag[]> = {};
    sidebar?.forEach((mealType) => {
      map[mealType.name] = mealType.tags;
    });
    return map;
  }, [sidebar]);

  // HOTFIX przy zmianie filtrów
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["meals"], exact: false });
    queryClient.invalidateQueries({
      queryKey: ["meal-statuses"],
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
    userId: currentUserId,
  });

  const meals =
    (data as InfiniteData<MealsPage> | undefined)?.pages.flatMap(
      (page: MealsPage) => page.data
    ) ?? [];

  const { data: statuses } = useMealStatuses(meals, currentUserId);

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

  if (isLoading || !statuses)
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

  if (meals.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <p>Brak posiłków</p>
      </div>
    );

  return (
    <>
      <div className="grid grid-cols-1 p-4 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {meals.map((meal: MealData, index: number) => {
          const isLast = index === meals.length - 1;
          const status: MealStatus = statuses[meal.id];

          return (
            <div key={meal.id} ref={isLast ? lastMealRef : null}>
              <Meal
                meal_id={meal.id}
                meal_type={meal.meal_type}
                name={meal.name}
                image={meal.image?.url || null}
                tagsForMealType={tagsMap[meal.meal_type] ?? []}
                onClick={() => setSelectedMeal(meal)}
                new={status.new}
                rating={status.rating ?? null}
              />
            </div>
          );
        })}

        {isFetchingNextPage && renderSkeletons(6)}
      </div>

      {selectedMeal && (
        <MealDialog
          isOpen={!!selectedMeal}
          meal={selectedMeal}
          status={statuses[selectedMeal.id]} //
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </>
  );
};
