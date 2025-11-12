import axios from "axios";
import type { MealsResponse } from "../types/meals";

export const fetchMeals = async (
  cursor: number | null
): Promise<MealsResponse> => {
  const params: Record<string, any> = { limit: 30 };
  if (cursor) params.cursor = cursor;

  const response = await axios.get<MealsResponse>(
    "http://localhost:3000/meals",
    { params }
  );
  return response.data;
};

export const hideMeal = async (meal_id: number, hidden = true) => {
  const response = await axios.patch(
    `http://localhost:3000/meals/${meal_id}/hide`,
    {
      hidden,
    }
  );
  return response.data;
};
