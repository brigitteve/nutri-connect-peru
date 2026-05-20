import quinoa from "@/assets/dish-quinoa.jpg";
import ceviche from "@/assets/dish-ceviche.jpg";
import lomo from "@/assets/dish-lomo.jpg";

export type Dish = {
  id: string;
  name: string;
  image: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
  tags: string[];
  category: "Almuerzo" | "Cena" | "Desayuno";
  restaurant: string;
  premium?: boolean;
  description: string;
  ingredients: string[];
};

export const dishes: Dish[] = [
  {
    id: "quinoa-power",
    name: "Bowl Quinoa Andina",
    image: quinoa,
    kcal: 520,
    protein: 38,
    carbs: 48,
    fat: 18,
    price: 24,
    tags: ["Alta proteína", "Sin gluten"],
    category: "Almuerzo",
    restaurant: "Verde Andino",
    premium: true,
    description:
      "Bowl personalizado con quinoa orgánica, pollo a la plancha, palta, maíz morado y vegetales frescos. Diseñado por nuestra nutricionista para tus macros.",
    ingredients: ["Quinoa 120g", "Pechuga de pollo 150g", "Palta 60g", "Maíz morado 40g", "Tomate cherry", "Aceite de oliva 1 cda"],
  },
  {
    id: "ceviche-light",
    name: "Ceviche Light de Pescado",
    image: ceviche,
    kcal: 380,
    protein: 42,
    carbs: 28,
    fat: 8,
    price: 28,
    tags: ["Bajo en grasa", "Gestantes"],
    category: "Almuerzo",
    restaurant: "Mar Limeño",
    description:
      "Receta tradicional reducida en sodio, lenguado fresco, camote dorado y cancha tostada. Ideal para tu plan nutricional.",
    ingredients: ["Lenguado 180g", "Limón", "Cebolla roja", "Camote 80g", "Cancha 20g", "Ají amarillo"],
  },
  {
    id: "lomo-fit",
    name: "Lomo Saltado Fit",
    image: lomo,
    kcal: 610,
    protein: 45,
    carbs: 62,
    fat: 18,
    price: 32,
    tags: ["Alta proteína", "Premium"],
    category: "Almuerzo",
    restaurant: "Sazón Saludable",
    premium: true,
    description:
      "Versión balanceada del clásico peruano: arroz integral, lomo magro y vegetales salteados al wok con menos aceite.",
    ingredients: ["Lomo de res 160g", "Arroz integral 100g", "Cebolla", "Tomate", "Ají amarillo", "Sillao bajo sodio"],
  },
];

export const getDish = (id: string) => dishes.find((d) => d.id === id);
