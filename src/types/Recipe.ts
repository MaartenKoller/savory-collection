
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

export enum ComparisonType {
  EXACT = "EXACT",
  MINIMUM = "MINIMUM",
  MAXIMUM = "MAXIMUM",
  GREATER = "GREATER",
  LESS = "LESS"
}

export interface NumericSearchCriteria {
  value?: number;
  comparisonType?: ComparisonType;
}

export interface RecipeSearchRequest {
  textSearch?: string;
  vegetarian?: boolean;
  servings?: NumericSearchCriteria;
  prepTime?: NumericSearchCriteria;
  cookTime?: NumericSearchCriteria;
}
