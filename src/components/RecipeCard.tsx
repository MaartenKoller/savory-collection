
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Recipe } from '@/types/Recipe';
import { Clock, Leaf, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  // Default image if none provided
  const imageUrl = recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80';
  
  return (
    <Link to={`/recipes/${recipe.id}`}>
      <Card className="overflow-hidden h-full transition-transform hover:-translate-y-1 hover:shadow-md">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={recipe.name} 
            className="w-full h-full object-cover"
          />
          {recipe.isVegetarian && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-sage text-white">
                <Leaf className="h-3 w-3 mr-1" />
                Vegetarian
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="pt-4">
          <h3 className="font-serif text-xl font-medium mb-2 line-clamp-1">{recipe.name}</h3>
          <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {recipe.ingredients.slice(0, 3).join(', ')}
            {recipe.ingredients.length > 3 ? '...' : ''}
          </div>
        </CardContent>
        <CardFooter className="text-muted-foreground text-sm border-t flex justify-between pt-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RecipeCard;
