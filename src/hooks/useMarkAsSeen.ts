import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

const markAsSeen = async (user_id: number, meal_id: number) => {
  return api
    .patch(`/meal-statuses/${meal_id}/seen`, { user_id })
    .then((r) => r.data);
};

export function useMarkAsSeen(
  user_id: number,
  meal_id: number,
  isNew: boolean,
  onSeen: () => void
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const hasTriggered = useRef(false);

  const mutation = useMutation({
    mutationFn: () => markAsSeen(user_id, meal_id),
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
  }, [isNew, user_id, mutation, onSeen]);

  return ref;
}
