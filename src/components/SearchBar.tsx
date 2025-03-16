
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, Filter, X } from 'lucide-react';
import { RecipeSearchRequest } from '@/types/Recipe';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

interface SearchBarProps {
  onSearch: (searchParams: RecipeSearchRequest) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVegetarian, setIsVegetarian] = useState<boolean | undefined>(undefined);
  const [maxTime, setMaxTime] = useState(120);

  const handleSearch = () => {
    const searchParams: RecipeSearchRequest = {};
    
    if (searchTerm) {
      searchParams.name = searchTerm;
    }
    
    if (isVegetarian !== undefined) {
      searchParams.isVegetarian = isVegetarian;
    }
    
    if (maxTime < 120) {
      searchParams.maxPrepTime = maxTime;
      searchParams.maxCookTime = maxTime;
    }
    
    onSearch(searchParams);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setIsVegetarian(undefined);
    setMaxTime(120);
    onSearch({});
  };

  return (
    <div className="flex w-full gap-2 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Filters</h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="vegetarian" 
                  checked={isVegetarian === true}
                  onCheckedChange={(checked) => {
                    if (checked === 'indeterminate') return;
                    setIsVegetarian(checked ? true : undefined);
                  }}
                />
                <Label htmlFor="vegetarian">Vegetarian only</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Max Total Time: {maxTime} min</Label>
              <Slider
                value={[maxTime]}
                min={10}
                max={120}
                step={5}
                onValueChange={(values) => setMaxTime(values[0])}
              />
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button size="sm" onClick={handleSearch}>Apply Filters</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default SearchBar;
