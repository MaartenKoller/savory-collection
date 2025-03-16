
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import RecipeForm from '@/components/RecipeForm';
import { Recipe } from '@/types/Recipe';
import { fetchAllRecipes, updateRecipe as apiUpdateRecipe } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const EditRecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setIsLoading(true);
        const recipes = await fetchAllRecipes();
        const foundRecipe = recipes.find(r => r.id === Number(id));
        
        if (foundRecipe) {
          setRecipe(foundRecipe);
        } else {
          // For demo purposes - find in sample data if not in API
          const sampleRecipe = sampleRecipes.find(r => r.id === Number(id));
          if (sampleRecipe) {
            setRecipe(sampleRecipe);
          } else {
            toast({
              title: 'Recipe not found',
              description: 'The recipe you are trying to edit does not exist.',
              variant: 'destructive',
            });
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Failed to load recipe:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recipe. Please try again later.',
          variant: 'destructive',
        });
        
        // For demo purposes - find in sample data if API fails
        const sampleRecipe = sampleRecipes.find(r => r.id === Number(id));
        if (sampleRecipe) {
          setRecipe(sampleRecipe);
        } else {
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecipe();
  }, [id, navigate, toast]);

  const handleSubmit = async (updatedRecipe: Recipe) => {
    try {
      if (recipe?.id) {
        await apiUpdateRecipe(recipe.id, updatedRecipe);
        toast({
          title: 'Recipe updated',
          description: 'Your recipe has been successfully updated.',
        });
      }
    } catch (error) {
      console.error('Failed to update recipe:', error);
      toast({
        title: 'Error',
        description: 'Failed to update recipe. Please try again.',
        variant: 'destructive',
      });
      // For demo purposes, we'll still return successfully
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
            <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-medium mb-4">Recipe not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Return to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-serif font-bold text-center mb-8">Edit Recipe</h1>
        <RecipeForm 
          initialRecipe={recipe} 
          onSubmit={handleSubmit} 
          submitLabel="Update Recipe" 
        />
      </main>
    </div>
  );
};

// Sample data for demo purposes - remove in production
const sampleRecipes: Recipe[] = [
  {
    id: 1,
    name: "Vegetable Stir Fry",
    isVegetarian: true,
    prepTime: 15,
    cookTime: 10,
    ingredients: ["2 cups mixed vegetables", "2 tbsp soy sauce", "1 tbsp olive oil", "2 cloves garlic"],
    instructions: "Heat oil in a pan. Add garlic and stir fry for 30 seconds. Add vegetables and cook for 5 minutes. Add soy sauce and cook for another 2 minutes.",
    servings: 2,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Classic Beef Burger",
    isVegetarian: false,
    prepTime: 20,
    cookTime: 15,
    ingredients: ["500g ground beef", "4 burger buns", "1 onion", "4 slices cheese", "Lettuce and tomato"],
    instructions: "Mix ground beef with diced onion and form into patties. Grill for 5-7 minutes on each side. Top with cheese for the last minute. Serve on buns with lettuce and tomato.",
    servings: 4,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Pasta Primavera",
    isVegetarian: true,
    prepTime: 15,
    cookTime: 20,
    ingredients: ["300g pasta", "2 cups mixed vegetables", "2 tbsp olive oil", "1/4 cup parmesan cheese"],
    instructions: "Cook pasta according to package instructions. In a separate pan, sauté vegetables in olive oil. Toss pasta with vegetables and top with parmesan cheese.",
    servings: 3,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Berry Smoothie Bowl",
    isVegetarian: true,
    prepTime: 10,
    cookTime: 0,
    ingredients: ["1 cup mixed berries", "1 banana", "1/2 cup yogurt", "Toppings: granola, chia seeds, honey"],
    instructions: "Blend berries, banana, and yogurt until smooth. Pour into a bowl and add toppings.",
    servings: 1,
    image: "https://images.unsplash.com/photo-1501147830916-ce44a6359892?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
  },
];

export default EditRecipePage;
