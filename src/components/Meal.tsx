import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useHideMeal } from "@/hooks/useHideMeal";
import { MealTagsHoverCard } from "./MealTagsHoverCard";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";

interface MealProps {
  meal_id: number;
  meal_type: string | null;
  name: string | null;
  image: string | null;
}

export const Meal: React.FC<MealProps> = ({
  meal_id,
  meal_type,
  name,
  image,
}) => {
  const hideMealMutation = useHideMeal();
  const [tagsOpen, setTagsOpen] = React.useState(false);

  const handleHideClick = () => {
    hideMealMutation.mutate({ meal_id, hidden: true });
  };

  const { data: sidebarData } = useQuery({
    queryKey: ["sidebar"],
    queryFn: () => api.get("/sidebar").then((r) => r.data),
  });

  const tagsForMealType = React.useMemo(() => {
    if (!sidebarData || !meal_type) return [];
    const mealTypeObj = sidebarData.find((m: any) => m.name === meal_type);
    return mealTypeObj?.tags ?? [];
  }, [sidebarData, meal_type]);

  return (
    <div className="relative w-full aspect-3/5 rounded-md overflow-hidden shadow-md bg-gray-100">
      <div className="absolute top-0 left-0 w-full h-7 bg-white flex items-center px-2 gap-2 z-10">
        <button
          onClick={handleHideClick}
          className="w-3 h-3 rounded-full bg-red-500 cursor-pointer"
        />

        <HoverCard open={tagsOpen} onOpenChange={setTagsOpen}>
          <HoverCardTrigger asChild>
            <button className="w-3 h-3 rounded-full bg-yellow-400 cursor-pointer" />
          </HoverCardTrigger>

          <MealTagsHoverCard
            meal_id={meal_id}
            sidebarTags={tagsForMealType}
            isOpen={tagsOpen}
            onClose={() => setTagsOpen(false)}
          />
        </HoverCard>

        <button className="w-3 h-3 rounded-full bg-green-500" />
      </div>

      {image && (
        <img
          src={image}
          alt={name || "Meal"}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
      )}

      {meal_type && (
        <p className="absolute top-9 left-3 px-2 py-1 bg-black/60 text-white text-xs font-semibold rounded-md uppercase z-10">
          {meal_type}
        </p>
      )}

      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-white/90 flex items-center justify-center p-4 z-10">
        {name && (
          <h3 className="text-gray-900 text-base font-semibold text-center">
            {name}
          </h3>
        )}
      </div>
    </div>
  );
};
