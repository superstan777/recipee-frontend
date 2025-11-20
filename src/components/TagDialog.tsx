import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { useAddSidebarTag } from "@/hooks/useAddSidebarTag";

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealTypeId: number | null;
  mealTypeName: string | null;
}

export const TagDialog = ({
  open,
  onOpenChange,
  mealTypeId,
  mealTypeName,
}: TagDialogProps) => {
  const { mutate, isPending } = useAddSidebarTag();

  const currentUserId = 1;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!mealTypeId) return;

    const formData = new FormData(e.currentTarget);
    const tagName = formData.get("tag_name") as string;

    mutate(
      { user_id: currentUserId, meal_type_id: mealTypeId, tag_name: tagName },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (err) => {
          console.error("Błąd dodawania tagu:", err);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Dodaj nową kategorię</DialogTitle>
            <DialogDescription>
              Wpisz nazwę nowej kategorii przypisanej do{" "}
              <span className="font-medium text-foreground">
                {mealTypeName ?? "tego typu posiłku"}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="tag-name">Nazwa kategorii</Label>
            <Input
              id="tag-name"
              name="tag_name"
              placeholder="np. Wysokobiałkowy, Wege..."
              required
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Anuluj
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Dodawanie..." : "Dodaj tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
