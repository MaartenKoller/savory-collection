
import { useState } from 'react';
import { Recipe } from '@/types/Recipe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Clock, Trash, Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecipeFormProps {
  initialRecipe?: Recipe;
  onSubmit: (recipe: Recipe) => Promise<void>;
  submitLabel: string;
}

const emptyRecipe: Recipe = {
  name: '',
  isVegetarian: false,
  prepTime: 15,
  cookTime: 30,
  ingredients: [''],
  instructions: '',
  servings: 4
};

const RecipeForm = ({ initialRecipe, onSubmit, submitLabel }: RecipeFormProps) => {
  const [recipe, setRecipe] = useState<Recipe>(initialRecipe || emptyRecipe);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty ingredients
    const filteredRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.filter(ing => ing.trim() !== '')
    };
    
    try {
      setIsLoading(true);
      await onSubmit(filteredRecipe);
      navigate('/');
    } catch (error) {
      console.error('Error submitting recipe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecipe = (field: keyof Recipe, value: any) => {
    setRecipe({ ...recipe, [field]: value });
  };

  const updateIngredient = (index: number, value: string) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = value;
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] });
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{initialRecipe ? 'Edit Recipe' : 'Add New Recipe'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recipe Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Recipe Name</Label>
            <Input 
              id="name" 
              value={recipe.name} 
              onChange={(e) => updateRecipe('name', e.target.value)}
              required
            />
          </div>

          {/* Vegetarian Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={recipe.isVegetarian}
              onCheckedChange={(checked) => updateRecipe('isVegetarian', checked)}
              id="vegetarian"
            />
            <Label htmlFor="vegetarian">Vegetarian</Label>
          </div>

          {/* Preparation Time and Cook Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prepTime">
                <Clock className="h-4 w-4 inline mr-1" />
                Prep Time (minutes)
              </Label>
              <Input 
                id="prepTime" 
                type="number" 
                min="0"
                value={recipe.prepTime} 
                onChange={(e) => updateRecipe('prepTime', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookTime">
                <Clock className="h-4 w-4 inline mr-1" />
                Cook Time (minutes)
              </Label>
              <Input 
                id="cookTime" 
                type="number" 
                min="0"
                value={recipe.cookTime} 
                onChange={(e) => updateRecipe('cookTime', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings">
                <Users className="h-4 w-4 inline mr-1" />
                Servings
              </Label>
              <Input 
                id="servings" 
                type="number" 
                min="1"
                value={recipe.servings} 
                onChange={(e) => updateRecipe('servings', parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <Label>Ingredients</Label>
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={ingredient} 
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="e.g. 2 cups flour"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => removeIngredient(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addIngredient}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea 
              id="instructions" 
              value={recipe.instructions} 
              onChange={(e) => updateRecipe('instructions', e.target.value)}
              className="min-h-[200px]"
              placeholder="Step by step instructions..."
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : submitLabel}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default RecipeForm;
