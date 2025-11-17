import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useHideMeal } from "@/hooks/useHideMeal";
import { useMarkAsSeen } from "@/hooks/useMarkAsSeen";
import { MealTagsHoverCard } from "./MealTagsHoverCard";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { Trash2, Tag, Star, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MealProps {
  meal_id: number;
  meal_type: string | null;
  name: string | null;
  image: string | null;
  new: boolean;
}

interface SidebarTag {
  id: number;
  tag_name: string;
}

interface SidebarItem {
  id: number;
  name: string;
  tags: SidebarTag[];
}

export const Meal: React.FC<MealProps> = ({
  meal_id,
  meal_type,
  name,
  image,
  new: isNew,
}) => {
  const hideMealMutation = useHideMeal();
  const [tagsOpen, setTagsOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const handleHideClick = () => {
    hideMealMutation.mutate({ meal_id, hidden: true });
  };

  const markRef = useMarkAsSeen(meal_id, isNew);

  const { data: sidebarData } = useQuery<SidebarItem[]>({
    queryKey: ["sidebar"],
    queryFn: () => api.get("/sidebar").then((r) => r.data),
  });

  const tagsForMealType = React.useMemo<SidebarTag[]>(() => {
    if (!sidebarData || !meal_type) return [];
    const mealTypeObj = sidebarData.find((m) => m.name === meal_type);
    return mealTypeObj?.tags ?? [];
  }, [sidebarData, meal_type]);

  return (
    <div
      ref={markRef}
      className="relative w-full aspect-3/5 rounded-md shadow-md bg-gray-100"
    >
      {isNew && (
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg z-20 ">
          <Sparkles size={16} color="white" />
        </div>
      )}

      {image && (
        <div className="absolute top-0 left-0 w-full h-full rounded-md overflow-hidden z-0">
          <img
            src={image}
            alt={name || "Meal"}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        {meal_type && (
          <p className="px-3 py-1 bg-black/60 text-white text-sm font-semibold rounded-md uppercase">
            {meal_type}
          </p>
        )}

        <div className="flex gap-2">
          {/* <button
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-white shadow-md cursor-pointer"
            aria-label="Rate meal"
          >
            <Star size={20} color="black" />
          </button> */}

          <HoverCard open={tagsOpen} onOpenChange={setTagsOpen}>
            <HoverCardTrigger asChild>
              <button
                onClick={() => isMobile && setTagsOpen(!tagsOpen)}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-white shadow-md cursor-pointer"
                aria-label="Show tags"
              >
                <Tag size={20} color="black" />
              </button>
            </HoverCardTrigger>

            <MealTagsHoverCard
              meal_id={meal_id}
              sidebarTags={tagsForMealType}
              isOpen={tagsOpen}
              onClose={() => setTagsOpen(false)}
            />
          </HoverCard>

          <button
            onClick={handleHideClick}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-white shadow-md cursor-pointer"
            aria-label="Hide meal"
          >
            <Trash2 size={20} color="black" />
          </button>
        </div>
      </div>

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
