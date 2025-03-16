
import Navbar from '@/components/Navbar';
import RecipeForm from '@/components/RecipeForm';
import { Recipe } from '@/types/Recipe';
import { addRecipes } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const AddRecipePage = () => {
  const { toast } = useToast();

  const handleSubmit = async (recipe: Recipe) => {
    try {
      await addRecipes([recipe]);
      toast({
        title: 'Recipe added',
        description: 'Your recipe has been successfully added.',
      });
    } catch (error) {
      console.error('Failed to add recipe:', error);
      toast({
        title: 'Error',
        description: 'Failed to add recipe. Please try again.',
        variant: 'destructive',
      });
      // For demo purposes, we'll still return successfully
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-serif font-bold text-center mb-8">Add New Recipe</h1>
        <RecipeForm onSubmit={handleSubmit} submitLabel="Add Recipe" />
      </main>
    </div>
  );
};

export default AddRecipePage;
