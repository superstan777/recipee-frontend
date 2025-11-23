import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import type { MealData, MealStatus } from "../types/meals";
import { MealRating } from "./MealRating";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRecipe } from "@/hooks/useRecipe";
import { Spinner } from "./ui/spinner";

interface MealDialogProps {
  isOpen: boolean;
  meal: MealData;
  status: MealStatus;
  onClose: () => void;
}

export const MealDialog: React.FC<MealDialogProps> = ({
  isOpen,
  meal,
  status,
  onClose,
}) => {
  const { recipe, loading, error } = useRecipe(meal?.id);

  if (!meal) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-[80vw] max-w-[95vw] sm:max-w-[1500px] h-[90vh] p-0 overflow-y-auto rounded-xl border-0">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Meal Dialog</DialogTitle>
            <DialogDescription>Contains meal details</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          <div className="flex flex-col">
            {meal.image?.url && (
              <img
                src={meal.image.url}
                alt={meal.name || "Meal image"}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex flex-col p-10 md:col-span-2 overflow-y-auto">
            <MealRating
              meal_id={meal.id}
              rating={status.rating}
              starSize={24}
            />
            <h2 className="text-3xl font-bold mt-4">{meal.name}</h2>

            {loading && (
              <div className="flex flex-1 justify-center items-center mt-6">
                <div className="flex items-center gap-2 opacity-80">
                  <Spinner className="h-6 w-6" />
                  <span className="text-lg text-gradient-animate">
                    Generowanie przepisu...
                  </span>
                </div>
              </div>
            )}
            {error && <p className="mt-6 text-red-500">Błąd: {error}</p>}

            {recipe && !loading && (
              <div className="mt-4 fade-in">
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-lg">Składniki:</h4>
                  <ul className="list-disc list-inside text-base opacity-80">
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{ing.name}</span> —{" "}
                        {ing.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-lg">
                    Sposób przygotowania:
                  </h4>
                  <ol className="list-decimal list-inside text-base opacity-80 space-y-1">
                    {recipe.instructions.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
