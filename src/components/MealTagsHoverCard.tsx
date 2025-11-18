import { useState, useEffect } from "react";
import { HoverCardContent } from "@/components/ui/hover-card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddMealTag } from "@/hooks/useAddMealTag";
import { useRemoveMealTag } from "@/hooks/useRemoveMealTag";
import { useMealTags } from "@/hooks/useMealTags";

interface MealTagsHoverCardProps {
  meal_id: number;
  sidebarTags: { id: number; tag_name: string }[];
  isOpen: boolean;
  onClose?: () => void;
}

export const MealTagsHoverCard: React.FC<MealTagsHoverCardProps> = ({
  meal_id,
  sidebarTags,
  isOpen,
}) => {
  const { data: mealTags, isLoading, refetch } = useMealTags(meal_id);
  const addMealTag = useAddMealTag();
  const removeMealTag = useRemoveMealTag();

  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) refetch();
  }, [isOpen, refetch]);

  useEffect(() => {
    if (mealTags) {
      setSelectedTags(mealTags.map((mt) => mt.tag.id));
    }
  }, [mealTags]);

  const handleCheckboxChange = (tagId: number) => {
    const isSelected = selectedTags.includes(tagId);

    setSelectedTags((prev) =>
      isSelected ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );

    const mutation = isSelected ? removeMealTag : addMealTag;

    mutation.mutate(
      { meal_id, tag_id: tagId },
      {
        onError: () => {
          setSelectedTags((prev) =>
            isSelected ? [...prev, tagId] : prev.filter((id) => id !== tagId)
          );
        },
        onSettled: () => {
          refetch();
        },
      }
    );
  };

  return (
    <HoverCardContent side="right" align="start" className="w-64">
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="text-sm text-gray-500">Ładowanie…</div>
        ) : sidebarTags.length === 0 ? (
          <div className="text-sm text-gray-500">Brak tagów do dodania</div>
        ) : (
          sidebarTags.map((tag) => (
            <label
              key={tag.id}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <Checkbox
                checked={selectedTags.includes(tag.id)}
                onCheckedChange={() => handleCheckboxChange(tag.id)}
              />
              {tag.tag_name}
            </label>
          ))
        )}
      </div>
    </HoverCardContent>
  );
};
