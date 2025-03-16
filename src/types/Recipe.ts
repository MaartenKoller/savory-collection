
export interface Recipe {
  id?: number;
  name: string;
  isVegetarian: boolean;
  prepTime: number;
  cookTime: number;
  ingredients: string[];
  instructions: string;
  servings: number;
  image?: string; // For frontend display purposes
}

export interface RecipeRequest {
  recipes: Recipe[];
}

export interface RecipeSearchRequest {
  name?: string;
  isVegetarian?: boolean;
  maxPrepTime?: number;
  maxCookTime?: number;
  ingredients?: string[];
}
