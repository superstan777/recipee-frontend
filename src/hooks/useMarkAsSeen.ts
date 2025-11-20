import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

const markAsSeen = async (mealId: number, userId: number) => {
  return api
    .patch(`/meal-statuses/${mealId}/seen`, { userId })
    .then((r) => r.data);
};

export function useMarkAsSeen(
  mealId: number,
  isNew: boolean,
  onSeen: () => void,
  userId: number
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const hasTriggered = useRef(false);

  const mutation = useMutation({
    mutationFn: () => markAsSeen(mealId, userId),
    onError: (err) => console.error("markAsSeen error:", err),
  });

  useEffect(() => {
    if (!isNew) return;
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.intersectionRatio === 1 && !hasTriggered.current) {
          hasTriggered.current = true;
          onSeen();
          mutation.mutate();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isNew, userId, mutation, onSeen]);

  return ref;
}
