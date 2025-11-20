import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { MealData, MealStatus } from "../types/meals";
import { MealRating } from "./MealRating";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface MealDialogProps {
  isOpen: boolean;
  meal: MealData;
  status: MealStatus;
  onClose: () => void;
}

interface Recipe {
  ingredients: string[];
  steps: string[];
}

export const MealDialog: React.FC<MealDialogProps> = ({
  isOpen,
  meal,
  status,
  onClose,
}) => {
  const [recipeJSON, setRecipeJSON] = useState<string>("");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSaveRecipe = () => {
    try {
      const parsed: Recipe = JSON.parse(recipeJSON);
      setRecipe(parsed);
      setError(null);
    } catch {
      setError("Nieprawidłowy format JSON");
    }
  };

  if (!meal) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-[80vw] max-w-[95vw] sm:max-w-[1500px] h-[90vh] p-0 overflow-y-auto rounded-xl border-0">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* COLUMN 1 — IMAGE */}
          <div className="flex flex-col">
            {meal.image?.url && (
              <img
                src={meal.image.url}
                alt={meal.name || "Meal image"}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* COLUMN 2+3 — DETAILS + RECIPE */}
          <div className="flex flex-col p-10 md:col-span-2 overflow-y-auto">
            <MealRating
              meal_id={meal.id}
              rating={status.rating}
              starSize={24}
            />
            <h2 className="text-3xl font-bold mt-4">{meal.name}</h2>

            {!recipe && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-1">Brak przepisu</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Wklej przepis w formacie JSON
                </p>

                <Textarea
                  value={recipeJSON}
                  onChange={(e) => setRecipeJSON(e.target.value)}
                  placeholder={`{
  "ingredients": ["200g kurczaka", "100g ryżu", "50g brokułów"],
  "steps": ["Ugotuj ryż", "Podsmaż kurczaka", "Dodaj brokuły", "Połącz i dopraw"]
}`}
                />

                {error && <p className="text-red-500 mt-1">{error}</p>}

                <div className="flex justify-end mt-2">
                  <Button
                    onClick={handleSaveRecipe}
                    className="px-4 py-2 text-white rounded-lg"
                  >
                    Zapisz
                  </Button>
                </div>
              </div>
            )}

            {recipe && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Przepis</h3>
                {/* Składniki */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-1">Składniki:</h4>
                  <ul className="list-disc list-inside text-base opacity-80">
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </div>
                {/* Sposób przygotowania */}
                <div>
                  <h4 className="font-semibold mb-1">Sposób przygotowania:</h4>
                  <ol className="list-decimal list-inside text-base opacity-80">
                    {recipe.steps.map((step, idx) => (
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
