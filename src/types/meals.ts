export interface MealData {
  pagination_id: number;
  id: number;
  name: string;
  meal_type: string;
  image: {
    url: string | null;
    local_path: string | null;
  };
}

export interface MealsPage {
  data: MealData[];
  nextCursor: number | null;
}
