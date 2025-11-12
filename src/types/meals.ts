export interface MealData {
  id: number;
  meal_id: number;
  name: string | null;
  meal_type: string | null;
  hidden: boolean;
  done: boolean;
  rating: string | null;
  created_at: string;
  image: {
    url: string | null;
    local_path: string | null;
  } | null;
}

export interface MealsResponse {
  data: MealData[];
  nextCursor: number | null;
}
