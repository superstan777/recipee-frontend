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
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useAddSidebarTag } from "@/hooks/useAddSidebarTag";
import { useState, useEffect } from "react";

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
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    defaultValues: {
      tag_name: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = (values: { tag_name: string }) => {
    if (!mealTypeId) return;

    setErrorMessage("");

    mutate(
      {
        meal_type_id: mealTypeId,
        tag_name: values.tag_name,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          const backendMsg = error?.response?.data?.message;

          if (backendMsg) {
            setErrorMessage(backendMsg);
            return;
          }

          setErrorMessage("Wystąpił błąd. Spróbuj ponownie");
        },
      }
    );
  };

  useEffect(() => {
    if (!open) {
      setErrorMessage("");
      form.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nową kategorię</DialogTitle>
          <DialogDescription>
            Wpisz nazwę nowej kategorii przypisanej do{" "}
            <span className="font-medium text-foreground">
              {mealTypeName ?? "tego typu posiłku"}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-2"
          >
            <FormField
              control={form.control}
              name="tag_name"
              rules={{ required: "Nazwa jest wymagana" }}
              render={({ field }) => (
                <FormItem>
                  <Label>Nazwa kategorii</Label>
                  <FormControl>
                    <Input
                      placeholder="np. Wysokobiałkowy, Wege..."
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
