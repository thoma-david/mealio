// src/types/recipe.ts

export type NutrientDetail = {
  value: number;
  unit: string;
};

export type Nutrients = {
  calories: NutrientDetail;
  protein: NutrientDetail;
  fat: NutrientDetail;
  saturatedFat?: NutrientDetail;
  carbohydrates: NutrientDetail;
  sugar?: NutrientDetail;
  fiber?: NutrientDetail;
  salt?: NutrientDetail;
  cholesterol?: NutrientDetail;

  vitamins?: {
    vitaminA?: NutrientDetail;
    vitaminB1?: NutrientDetail;
    vitaminB6?: NutrientDetail;
    vitaminB12?: NutrientDetail;
    vitaminC?: NutrientDetail;
    vitaminD?: NutrientDetail;
    vitaminE?: NutrientDetail;
    vitaminK?: NutrientDetail;
  };

  minerals?: {
    iron?: NutrientDetail;
    magnesium?: NutrientDetail;
    potassium?: NutrientDetail;
    calcium?: NutrientDetail;
    zinc?: NutrientDetail;
    selenium?: NutrientDetail;
  };
};

export type IngredientRef = {
  ingredient: {
    _id: string;
    name: string;
    defaultUnit?: string;
    // evtl. weitere Felder wie nutrientsPer100g
  };
  amount: number;
  unit: string;
  isOptional?: boolean;
  raw?: boolean;
};

export type Recipe = {
  _id: string;
  name: string;
  description: string;
  image: string;
  servings: number;
  preparationTime: number;
  difficulty: "easy" | "medium" | "hard";
  mealType: string;
  ingredients: IngredientRef[];
  steps: string[];
  nutrients: Nutrients;
  estimatedPrice: number;
  allergens: string[];
  tags: string[];
  healthBenefits?: string[];
  contraindications?: string[];
  therapeuticGoals?: string[];
  suitableFor?: string[];
  excludedFor?: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};
