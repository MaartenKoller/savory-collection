import { useEffect, useState } from 'react';
import { Recipe, RecipeSearchRequest } from '@/types/Recipe';
import { fetchAllRecipes, searchRecipes } from '@/services/api';
import Navbar from '@/components/Navbar';
import RecipeCard from '@/components/RecipeCard';
import SearchBar from '@/components/SearchBar';
import { useToast } from '@/components/ui/use-toast';

const HomePage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Failed to load recipes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load recipes. Please try again later.',
        variant: 'destructive',
      });
      // For demo purposes, load sample data if API fails
      setRecipes(sampleRecipes);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchParams: RecipeSearchRequest) => {
    try {
      setIsLoading(true);
      const results = await searchRecipes(searchParams);
      setRecipes(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to search recipes. Please try again.',
        variant: 'destructive',
      });
      // For demo purposes, apply mock filtering if the API call fails
      // This will be replaced with the actual API call in production
      applyMockFiltering(searchParams);
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes only - remove in production
  const applyMockFiltering = (params: RecipeSearchRequest) => {
    // Start with all sample recipes
    let filtered = [...sampleRecipes];
    
    // Apply text search filter
    if (params.textSearch) {
      const searchLower = params.textSearch.toLowerCase();
      filtered = filtered.filter(recipe => 
        (recipe.name && recipe.name.toLowerCase().includes(searchLower)) ||
        (recipe.instructions && recipe.instructions.toLowerCase().includes(searchLower)) ||
        (recipe.ingredients && recipe.ingredients.some(i => i.toLowerCase().includes(searchLower)))
      );
    }
    
    // Apply vegetarian filter
    if (params.vegetarian !== undefined) {
      filtered = filtered.filter(r => r.isVegetarian === params.vegetarian);
    }
    
    // Apply prep time filter
    if (params.prepTime?.value !== undefined) {
      const value = params.prepTime.value;
      const compType = params.prepTime.comparisonType;
      
      filtered = filtered.filter(r => {
        switch(compType) {
          case 'EXACT': return r.prepTime === value;
          case 'MINIMUM': return r.prepTime >= value;
          case 'MAXIMUM': return r.prepTime <= value;
          case 'GREATER': return r.prepTime > value;
          case 'LESS': return r.prepTime < value;
          default: return true;
        }
      });
    }
    
    // Apply cook time filter
    if (params.cookTime?.value !== undefined) {
      const value = params.cookTime.value;
      const compType = params.cookTime.comparisonType;
      
      filtered = filtered.filter(r => {
        switch(compType) {
          case 'EXACT': return r.cookTime === value;
          case 'MINIMUM': return r.cookTime >= value;
          case 'MAXIMUM': return r.cookTime <= value;
          case 'GREATER': return r.cookTime > value;
          case 'LESS': return r.cookTime < value;
          default: return true;
        }
      });
    }
    
    // Apply servings filter
    if (params.servings?.value !== undefined) {
      const value = params.servings.value;
      const compType = params.servings.comparisonType;
      
      filtered = filtered.filter(r => {
        switch(compType) {
          case 'EXACT': return r.servings === value;
          case 'MINIMUM': return r.servings >= value;
          case 'MAXIMUM': return r.servings <= value;
          case 'GREATER': return r.servings > value;
          case 'LESS': return r.servings < value;
          default: return true;
        }
      });
    }
    
    setRecipes(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4 flex-1">
        <h1 className="text-4xl font-serif font-bold mb-8 text-center text-navy">Discover Delicious Recipes</h1>
        
        <SearchBar onSearch={handleSearch} />
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-muted animate-pulse h-64 rounded-md"></div>
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center my-12">
            <h2 className="text-2xl font-medium mb-4">No recipes found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
      
      <footer className="bg-cream mt-auto py-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Savory Collection. All rights reserved.</p>
        </div>
      </footer>
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

export default HomePage;
