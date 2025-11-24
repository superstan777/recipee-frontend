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
      <DialogContent
        className="overflow-y-auto 
      w-screen h-screen p-0 rounded-none
      md:top-1/2 md:left-1/2 md:w-[80vw] md:h-[90vh] md:max-w-[1500px] md:translate-x-[-50%] md:translate-y-[-50%] md:rounded-xl
      "
      >
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Meal Dialog</DialogTitle>
            <DialogDescription>Contains meal details</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* IMAGE */}
          <div className="flex flex-col h-64 sm:h-auto">
            {meal.image?.url && (
              <img
                src={meal.image.url}
                alt={meal.name || "Meal image"}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* DETAILS + RECIPE */}
          <div className="flex flex-col p-6 sm:p-10 md:col-span-2 md:overflow-y-auto">
            <MealRating
              meal_id={meal.id}
              rating={status.rating}
              starSize={24}
            />
            <h2 className="text-2xl sm:text-3xl font-bold mt-4">{meal.name}</h2>

            {loading && (
              <div className="flex flex-1 justify-center items-center mt-6">
                <div className="flex items-center gap-2 opacity-80">
                  <Spinner className="h-6 w-6 shimmer-metal" />
                  <span className="text-lg shimmer-metal font-semibold">
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
