
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllRecipes, deleteRecipe as apiDeleteRecipe } from '@/services/api';
import { Recipe } from '@/types/Recipe';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import { Clock, Leaf, Users, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
              description: 'The recipe you are looking for does not exist.',
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
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecipe();
  }, [id, navigate, toast]);

  const handleDelete = async () => {
    try {
      if (recipe?.id) {
        await apiDeleteRecipe(recipe.id);
        toast({
          title: 'Recipe deleted',
          description: 'The recipe has been successfully deleted.',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete recipe. Please try again later.',
        variant: 'destructive',
      });
      // For demo, navigate anyway
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
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
          <Button onClick={() => navigate('/')}>Return to Recipes</Button>
        </div>
      </div>
    );
  }

  // Default image if none provided
  const imageUrl = recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
            >
              Back to Recipes
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/recipes/edit/${recipe.id}`)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Recipe
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Recipe
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the recipe "{recipe.name}".
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">{recipe.name}</h1>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {recipe.isVegetarian && (
              <Badge className="bg-sage text-white">
                <Leaf className="h-3 w-3 mr-1" />
                Vegetarian
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Prep: {recipe.prepTime} min
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Cook: {recipe.cookTime} min
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              Serves: {recipe.servings}
            </Badge>
          </div>
          
          <div className="mb-8 rounded-lg overflow-hidden h-[300px] md:h-[400px]">
            <img 
              src={imageUrl} 
              alt={recipe.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <h2 className="text-xl font-serif font-medium mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-accent w-1.5 h-1.5 rounded-full mt-2 mr-2"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <div className="md:col-span-2">
              <h2 className="text-xl font-serif font-medium mb-4">Instructions</h2>
              <div className="space-y-4">
                {recipe.instructions.split('\n').map((step, index) => (
                  <p key={index}>{step}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Separator className="mt-12" />
      
      <footer className="py-6">
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

export default RecipeDetail;
