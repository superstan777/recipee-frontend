import { Star } from "lucide-react";
import { useRateMeal } from "@/hooks/useRateMeal";

interface MealRatingProps {
  meal_id: number;
  rating: number | null;
  starSize?: number;
}

export const MealRating: React.FC<MealRatingProps> = ({
  meal_id,
  rating,
  starSize = 20,
}) => {
  const rateMeal = useRateMeal();

  const handleRate = (value: number) => {
    const newRating = rating === value ? null : value;
    rateMeal.mutate({ meal_id, rating: newRating });
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={starSize}
          color="black"
          fill={rating !== null && value <= rating ? "black" : "white"}
          onClick={() => handleRate(value)}
          className="cursor-pointer transition-colors"
        />
      ))}
    </div>
  );
};
