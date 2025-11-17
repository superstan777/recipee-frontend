// types/meals.ts
export interface MealData {
  pagination_id: number;
  id: number;
  name: string;
  meal_type: string | null;
  hidden: boolean;
  rating: string | null; // liczba w backendzie -> string | null w frontendzie
  new: boolean;
  created_at: string;
  image: {
    url: string | null;
    local_path: string | null;
  } | null;
  tags: { id: number; tag_name: string; meal_type_id: number }[];
}

// pojedyncza strona z backendu
export interface MealsPage {
  data: MealData[];
  nextCursor: number | null;
}
