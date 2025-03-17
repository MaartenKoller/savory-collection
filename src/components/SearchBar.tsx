
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, Filter, X } from 'lucide-react';
import { RecipeSearchRequest, ComparisonType, NumericSearchCriteria } from '@/types/Recipe';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchBarProps {
  onSearch: (searchParams: RecipeSearchRequest) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [isVegetarian, setIsVegetarian] = useState<boolean | undefined>(undefined);
  
  // Prep time criteria
  const [prepTimeValue, setPrepTimeValue] = useState<number>(60);
  const [prepTimeComparison, setPrepTimeComparison] = useState<ComparisonType>(ComparisonType.MAXIMUM);
  const [usePrepTimeFilter, setUsePrepTimeFilter] = useState(false);
  
  // Cook time criteria
  const [cookTimeValue, setCookTimeValue] = useState<number>(60);
  const [cookTimeComparison, setCookTimeComparison] = useState<ComparisonType>(ComparisonType.MAXIMUM);
  const [useCookTimeFilter, setUseCookTimeFilter] = useState(false);
  
  // Servings criteria
  const [servingsValue, setServingsValue] = useState<number>(4);
  const [servingsComparison, setServingsComparison] = useState<ComparisonType>(ComparisonType.EXACT);
  const [useServingsFilter, setUseServingsFilter] = useState(false);

  const handleSearch = () => {
    const searchParams: RecipeSearchRequest = {};
    
    if (textSearch.trim()) {
      searchParams.textSearch = textSearch.trim();
    }
    
    if (isVegetarian !== undefined) {
      searchParams.vegetarian = isVegetarian;
    }
    
    if (usePrepTimeFilter) {
      searchParams.prepTime = {
        value: prepTimeValue,
        comparisonType: prepTimeComparison
      };
    }
    
    if (useCookTimeFilter) {
      searchParams.cookTime = {
        value: cookTimeValue,
        comparisonType: cookTimeComparison
      };
    }
    
    if (useServingsFilter) {
      searchParams.servings = {
        value: servingsValue,
        comparisonType: servingsComparison
      };
    }
    
    onSearch(searchParams);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setTextSearch('');
    setIsVegetarian(undefined);
    setUsePrepTimeFilter(false);
    setUseCookTimeFilter(false);
    setUseServingsFilter(false);
    setPrepTimeValue(60);
    setCookTimeValue(60);
    setServingsValue(4);
    setPrepTimeComparison(ComparisonType.MAXIMUM);
    setCookTimeComparison(ComparisonType.MAXIMUM);
    setServingsComparison(ComparisonType.EXACT);
    onSearch({});
  };

  return (
    <div className="flex w-full gap-2 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search recipes, ingredients, or instructions..."
          value={textSearch}
          onChange={(e) => setTextSearch(e.target.value)}
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
            
            {/* Prep Time Filter */}
            <div className="space-y-2 border-t pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="usePrepTime" 
                  checked={usePrepTimeFilter}
                  onCheckedChange={(checked) => {
                    if (checked === 'indeterminate') return;
                    setUsePrepTimeFilter(!!checked);
                  }}
                />
                <Label htmlFor="usePrepTime">Filter by Prep Time</Label>
              </div>
              
              {usePrepTimeFilter && (
                <div className="ml-6 space-y-2">
                  <div className="flex gap-2 items-center">
                    <Select
                      value={prepTimeComparison}
                      onValueChange={(value) => setPrepTimeComparison(value as ComparisonType)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Comparison" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ComparisonType.MAXIMUM}>Maximum</SelectItem>
                        <SelectItem value={ComparisonType.MINIMUM}>Minimum</SelectItem>
                        <SelectItem value={ComparisonType.EXACT}>Exactly</SelectItem>
                        <SelectItem value={ComparisonType.LESS}>Less than</SelectItem>
                        <SelectItem value={ComparisonType.GREATER}>Greater than</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm">{prepTimeValue} min</span>
                  </div>
                  <Slider
                    value={[prepTimeValue]}
                    min={5}
                    max={120}
                    step={5}
                    onValueChange={(values) => setPrepTimeValue(values[0])}
                  />
                </div>
              )}
            </div>

            {/* Cook Time Filter */}
            <div className="space-y-2 border-t pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="useCookTime" 
                  checked={useCookTimeFilter}
                  onCheckedChange={(checked) => {
                    if (checked === 'indeterminate') return;
                    setUseCookTimeFilter(!!checked);
                  }}
                />
                <Label htmlFor="useCookTime">Filter by Cook Time</Label>
              </div>
              
              {useCookTimeFilter && (
                <div className="ml-6 space-y-2">
                  <div className="flex gap-2 items-center">
                    <Select
                      value={cookTimeComparison}
                      onValueChange={(value) => setCookTimeComparison(value as ComparisonType)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Comparison" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ComparisonType.MAXIMUM}>Maximum</SelectItem>
                        <SelectItem value={ComparisonType.MINIMUM}>Minimum</SelectItem>
                        <SelectItem value={ComparisonType.EXACT}>Exactly</SelectItem>
                        <SelectItem value={ComparisonType.LESS}>Less than</SelectItem>
                        <SelectItem value={ComparisonType.GREATER}>Greater than</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm">{cookTimeValue} min</span>
                  </div>
                  <Slider
                    value={[cookTimeValue]}
                    min={5}
                    max={120}
                    step={5}
                    onValueChange={(values) => setCookTimeValue(values[0])}
                  />
                </div>
              )}
            </div>
            
            {/* Servings Filter */}
            <div className="space-y-2 border-t pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="useServings" 
                  checked={useServingsFilter}
                  onCheckedChange={(checked) => {
                    if (checked === 'indeterminate') return;
                    setUseServingsFilter(!!checked);
                  }}
                />
                <Label htmlFor="useServings">Filter by Servings</Label>
              </div>
              
              {useServingsFilter && (
                <div className="ml-6 space-y-2">
                  <div className="flex gap-2 items-center">
                    <Select
                      value={servingsComparison}
                      onValueChange={(value) => setServingsComparison(value as ComparisonType)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Comparison" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ComparisonType.EXACT}>Exactly</SelectItem>
                        <SelectItem value={ComparisonType.MINIMUM}>Minimum</SelectItem>
                        <SelectItem value={ComparisonType.MAXIMUM}>Maximum</SelectItem>
                        <SelectItem value={ComparisonType.LESS}>Less than</SelectItem>
                        <SelectItem value={ComparisonType.GREATER}>Greater than</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm">{servingsValue} servings</span>
                  </div>
                  <Slider
                    value={[servingsValue]}
                    min={1}
                    max={12}
                    step={1}
                    onValueChange={(values) => setServingsValue(values[0])}
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-between border-t pt-3">
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
