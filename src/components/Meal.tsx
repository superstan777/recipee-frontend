import { useState } from "react";
import { useMarkAsSeen } from "@/hooks/useMarkAsSeen";
import { MealTagsHoverCard } from "./MealTagsHoverCard";
import { Sparkles } from "lucide-react";
import { MealHideHoverCard } from "./MealHideHoverCard";
import { MealRatingHoverCard } from "./MealRatingHoverCard";

interface MealProps {
  meal_id: number;
  meal_type: string | null;
  name: string | null;
  image: string | null;
  new: boolean;
  tagsForMealType: { id: number; tag_name: string }[];
  rating: number | null;
}

export const Meal: React.FC<MealProps> = ({
  meal_id,
  meal_type,
  name,
  image,
  new: isNew,
  tagsForMealType,
  rating,
}) => {
  const [isNewLocal, setIsNewLocal] = useState(isNew);
  const [animateBadge, setAnimateBadge] = useState(false);

  const ref = useMarkAsSeen(meal_id, isNewLocal, () => {
    setAnimateBadge(true);

    setTimeout(() => setIsNewLocal(false), 300);
  });

  return (
    <div
      ref={ref}
      className="relative w-full aspect-3/5 rounded-md shadow-md bg-gray-100"
    >
      {isNewLocal && (
        <div
          className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg z-20
            transition-all duration-300 ease-out
            ${animateBadge ? "opacity-0 scale-50" : "opacity-100 scale-100"}
          `}
        >
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
          <MealRatingHoverCard meal_id={meal_id} rating={rating} />
          <MealTagsHoverCard meal_id={meal_id} sidebarTags={tagsForMealType} />
          <MealHideHoverCard meal_id={meal_id} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-white/90 flex items-center justify-center p-4 z-10 rounded-b-md">
        {name && (
          <h3 className="text-gray-900 text-base font-semibold text-center">
            {name}
          </h3>
        )}
      </div>
    </div>
  );
};
