import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useHideMeal } from "@/hooks/useHideMeal";
import { useMarkAsSeen } from "@/hooks/useMarkAsSeen";
import { MealTagsHoverCard } from "./MealTagsHoverCard";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { Trash2, Tag, Star, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SidebarMealType, SidebarTag } from "@/hooks/useSidebar";

interface MealProps {
  meal_id: number;
  meal_type: string | null;
  name: string | null;
  image: string | null;
  new: boolean;
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

  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  const handleHideClick = () => {
    hideMealMutation.mutate({ meal_id, hidden: true });
  };

  const markRef = useMarkAsSeen(meal_id, isNew);

  const { data: sidebarData } = useQuery<SidebarMealType[]>({
    queryKey: ["sidebar"],
    queryFn: () => api.get("/sidebar").then((r) => r.data),
  });

  const tagsForMealType = React.useMemo<SidebarTag[]>(() => {
    if (!sidebarData || !meal_type) return [];
    const mealTypeObj = sidebarData.find((m) => m.name === meal_type);
    return mealTypeObj?.tags ?? [];
  }, [sidebarData, meal_type]);

  return (
    <div className="relative">
      {isNew && (
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg z-20">
          <Sparkles size={16} color="white" />
        </div>
      )}

      <div
        ref={markRef}
        className="relative w-full aspect-3/5 rounded-md shadow-md bg-gray-100 overflow-hidden"
      >
        {image && !imgError && (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gray-300 animate-pulse" />
            )}

            <img
              src={image}
              alt={name || "Meal"}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        )}

        {!image || imgError ? (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
            Brak zdjęcia
          </div>
        ) : null}

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          {meal_type && (
            <p className="px-3 py-1 bg-black/60 text-white text-sm font-semibold rounded-md uppercase">
              {meal_type}
            </p>
          )}

          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer ">
              <Star size={20} color="black" />
            </button>

            <HoverCard open={tagsOpen} onOpenChange={setTagsOpen}>
              <HoverCardTrigger asChild>
                <button
                  onClick={() => isMobile && setTagsOpen(!tagsOpen)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer"
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
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer"
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
    </div>
  );
};
