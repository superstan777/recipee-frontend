export interface MealData {
  pagination_id: number;
  id: number;
  name: string;
  meal_type: string | null;
  hidden: boolean;
  done: boolean;
  rating: string | null;
  new: boolean;
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
