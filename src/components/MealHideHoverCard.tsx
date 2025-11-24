import { useState } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHideMeal } from "@/hooks/useHideMeal";

interface MealHideHoverCardProps {
  meal_id: number;
}

export const MealHideHoverCard: React.FC<MealHideHoverCardProps> = ({
  meal_id,
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const hideMeal = useHideMeal();

  const handleTriggerClick = () => {
    if (isMobile) setOpen((prev) => !prev);
  };

  const handleHide = () => {
    hideMeal.mutate({ meal_id });
    setOpen(false);
  };

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <button
          onClick={handleTriggerClick}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-100 transition cursor-pointer"
          aria-label="Hide meal"
        >
          <Trash2 size={20} />
        </button>
      </HoverCardTrigger>

      <HoverCardContent side="right" align="start" className="w-auto">
        <div className="text-sm mb-2">Usuń posiłek</div>

        <button
          onClick={handleHide}
          className="w-full text-center text-sm py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
        >
          Usuń
        </button>
      </HoverCardContent>
    </HoverCard>
  );
};
