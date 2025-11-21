import { useState } from "react";
import { motion } from "framer-motion";
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
  onClick?: () => void;
}

export const Meal: React.FC<MealProps> = ({
  meal_id,
  meal_type,
  name,
  image,
  new: isNew,
  tagsForMealType,
  rating,
  onClick,
}) => {
  const [isNewLocal, setIsNewLocal] = useState(isNew);
  const [animateNewIcon, setAnimateNewIcon] = useState(false);

  const currentUserId = 1; // temporary solution
  const ref = useMarkAsSeen(currentUserId, meal_id, isNewLocal, () =>
    setAnimateNewIcon(true)
  );

  return (
    <div
      ref={ref}
      className="relative w-full aspect-3/5 rounded-md shadow-md bg-gray-100"
    >
      {isNewLocal && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={
            animateNewIcon
              ? { opacity: 0, scale: 0.5 }
              : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.35, ease: "easeOut" }}
          onAnimationComplete={() => {
            if (animateNewIcon) setIsNewLocal(false);
          }}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg z-20"
        >
          <Sparkles size={16} color="white" />
        </motion.div>
      )}

      <div
        className="absolute top-4 right-4 flex gap-2 z-20"
        onClick={(e) => e.stopPropagation()} // <-- KLUCZOWE
      >
        <MealRatingHoverCard meal_id={meal_id} rating={rating} />
        <MealTagsHoverCard meal_id={meal_id} sidebarTags={tagsForMealType} />
        <MealHideHoverCard meal_id={meal_id} />
      </div>

      <div
        onClick={onClick}
        className="absolute inset-0 rounded-md overflow-hidden cursor-pointer"
      >
        {image && (
          <motion.img
            src={image}
            alt={name || "Meal"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {meal_type && (
          <p className="absolute top-4 left-4 px-3 py-1 bg-black/60 text-white text-sm font-semibold rounded-md uppercase z-10">
            {meal_type}
          </p>
        )}

        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-white/90 flex items-center justify-center p-4 z-10 rounded-b-md">
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
