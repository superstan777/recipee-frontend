import { useState } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRateMeal } from "@/hooks/useRateMeal";

interface MealRatingHoverCardProps {
  meal_id: number;
  rating: number | null;
}

export const MealRatingHoverCard: React.FC<MealRatingHoverCardProps> = ({
  meal_id,
  rating,
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const rateMeal = useRateMeal();

  const handleTriggerClick = () => {
    if (isMobile) setOpen((prev) => !prev);
  };

  const handleRate = (value: number) => {
    const newRating = rating === value ? null : value;
    rateMeal.mutate({ meal_id, rating: newRating });
    setOpen(false);
  };

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <button
          onClick={handleTriggerClick}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-100 transition cursor-pointer"
          aria-label="Rate meal"
        >
          <Star
            size={20}
            color="black"
            fill={rating !== null ? "black" : "transparent"}
          />
        </button>
      </HoverCardTrigger>

      <HoverCardContent side="right" align="start" className="w-auto">
        <div className="text-sm mb-2">Oceń posiłek</div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              size={20}
              key={value}
              color="black"
              fill={rating !== null && value <= rating ? "black" : "white"}
              onClick={() => handleRate(value)}
              className="cursor-pointer transition-colors"
            />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
