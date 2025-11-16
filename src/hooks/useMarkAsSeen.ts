import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

const markAsSeen = async (mealId: number) => {
  return api.patch(`/meals/${mealId}/seen`).then((r) => r.data);
};

export function useMarkAsSeen(mealId: number, isNew: boolean) {
  const hasSent = useRef(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const mutation = useMutation({
    mutationFn: () => markAsSeen(mealId),
    onError: (err) => console.error("markAsSeen error:", err),
  });

  useEffect(() => {
    if (!isNew) return;
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.intersectionRatio === 1 && !hasSent.current) {
          hasSent.current = true;
          mutation.mutate();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isNew]);

  return ref;
}
