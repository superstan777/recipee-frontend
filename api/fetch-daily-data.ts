import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
});

interface FetchedMeal {
  meal_id: number;
  meal_type_name: string;
  name: string | null;
  image: string | null;
}

interface MealData {
  id: number;
  name: string;
}

interface ImageData {
  type: string;
  file: string;
}

async function fetchMealsFromApi(): Promise<FetchedMeal[]> {
  const today = new Date().toISOString().split("T")[0];
  const url = `https://ntfy.pl/wp-json/dccore/v1/menu-planner?date=${today}&expansions__in=serving_id%2Cserving.multimedia_collection%2Cmeal_type_id%2Cmeal_id%2Cmeal.category_id%2Csize_id&brand_id=11&package_id=20`;

  const response = await axios.get(url);
  const data = response.data;

  if (!data?.includes?.meals) return [];

  const mealsMap = new Map<number, MealData>(
    data.includes.meals.map((m: MealData) => [m.id, m])
  );

  const imagesMap = new Map<number, ImageData[]>(
    data.includes.multimedia_collection.map(
      (m: { serving_id: number; images: ImageData[] }) => [
        m.serving_id,
        m.images,
      ]
    )
  );

  const results: FetchedMeal[] =
    data.results[today]?.map(
      (item: { meal_id: number; meal_type_id: number; serving_id: number }) => {
        const meal = mealsMap.get(item.meal_id);
        const images = imagesMap.get(item.serving_id) || [];
        const verticalImage = images.find(
          (img) => img.type === "MULTIMEDIA_VERTICAL"
        );
        const mealTypeName = data.includes.meal_types?.find(
          (mt: any) => mt.id === item.meal_type_id
        )?.name;

        return {
          meal_id: item.meal_id,
          meal_type_name: mealTypeName!,
          name: meal?.name || null,
          image: verticalImage
            ? `https://dccore.ntfy.pl/upload/multimedia/${verticalImage.file}`
            : null,
        };
      }
    ) ?? [];

  return results;
}

export default async function handler(req: any, res: any) {
  try {
    const meals = await fetchMealsFromApi();

    if (!meals.length) {
      return res
        .status(200)
        .json({ success: true, message: "Brak nowych danych do zapisania." });
    }

    await api.post("/add-meals", meals, {
      headers: { "Content-Type": "application/json" },
    });

    res.status(200).json({
      success: true,
      message: "Dane pobrane i wysłane do backendu pomyślnie.",
    });
  } catch (err: any) {
    console.error("Błąd w fetch-daily-data:", err.message || err);
    res
      .status(500)
      .json({ success: false, error: err.message || "Błąd serwera" });
  }
}
