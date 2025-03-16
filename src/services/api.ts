
import { Recipe, RecipeRequest, RecipeSearchRequest } from '@/types/Recipe';

const API_URL = 'http://localhost:9000/recipes'; // Adjust as needed for your backend

// Get all recipes
export const fetchAllRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

// Add recipes
export const addRecipes = async (recipes: Recipe[]): Promise<Recipe[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipes } as RecipeRequest),
    });
    if (!response.ok) {
      throw new Error('Failed to add recipes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding recipes:', error);
    throw error;
  }
};

// Update recipe
export const updateRecipe = async (id: number, recipe: Recipe): Promise<Recipe> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) {
      throw new Error('Failed to update recipe');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

// Delete recipe
export const deleteRecipe = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete recipe');
    }
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

// Search recipes
export const searchRecipes = async (searchParams: RecipeSearchRequest): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams),
    });
    if (!response.ok) {
      throw new Error('Failed to search recipes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};
