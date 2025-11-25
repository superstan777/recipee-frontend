import { useState } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Star } from "lucide-react";

import { MealRating } from "./MealRating";
import { useIsMobile } from "@/hooks/useBreakpoints";

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

  const handleTriggerClick = () => {
    if (isMobile) setOpen((prev) => !prev);
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
        <MealRating meal_id={meal_id} rating={rating} starSize={20} />
      </HoverCardContent>
    </HoverCard>
  );
};
