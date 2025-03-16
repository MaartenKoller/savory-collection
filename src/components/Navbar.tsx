
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, UtensilsCrossed } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-cream border-b border-border sticky top-0 z-10">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-terracotta" />
          <span className="font-serif text-2xl font-bold text-navy">Savory Collection</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/recipes/new">
            <Button className="bg-terracotta hover:bg-terracotta/90 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Recipe
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
