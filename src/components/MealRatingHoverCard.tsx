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
    rateMeal.mutate({ meal_id, rating: value });
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
          <Star size={20} />
        </button>
      </HoverCardTrigger>

      <HoverCardContent side="right" align="start" className="w-56">
        <div className="text-sm mb-2">Oceń posiłek</div>
        <div className="flex justify-between mt-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRate(value)}
              className={`p-1 rounded-md transition ${
                rating === value ? "bg-yellow-400" : "bg-gray-200"
              }`}
            >
              <Star size={20} color={rating === value ? "white" : "black"} />
            </button>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
