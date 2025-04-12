import { useState, useEffect } from "react";
import { Ingredient } from "@/ai/tools";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cartStore"; // Import the cart store hook

type RecipeIngredientsProps = {
  dish: string;
  ingredients: Ingredient[];
};

export const RecipeIngredients = ({ dish, ingredients }: RecipeIngredientsProps) => {
  // Get the addItems action from the cart store
  const addItemsToCart = useCartStore((state) => state.addItems);

  // State to track checked status of each ingredient
  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({});

  // Initialize checked state when ingredients change
  useEffect(() => {
    const initialState: Record<number, boolean> = {};
    ingredients.forEach((_, index) => {
      initialState[index] = true; // Default to checked
    });
    setCheckedState(initialState);
  }, [ingredients]); // Re-run if ingredients prop changes

  const handleCheckboxChange = (index: number, checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      setCheckedState(prevState => ({
        ...prevState,
        [index]: checked,
      }));
    }
  };

  const handleOrder = () => {
    const checkedIngredients = ingredients.filter((_, index) => checkedState[index]);
    console.log("Ordering checked ingredients:", checkedIngredients);
    // Add actual ordering logic here later
  };

  // Handler to add selected items to the cart store
  const handleAddToCart = () => {
    const selectedIngredients = ingredients.filter((_, index) => checkedState[index]);
    if (selectedIngredients.length > 0) {
      addItemsToCart(selectedIngredients);
      console.log("Added to cart:", selectedIngredients);
      // Optionally, provide user feedback (e.g., a toast notification)
    } else {
      console.log("No ingredients selected to add to cart.");
      // Optionally, provide user feedback
    }
  };

  return (
    <div className="p-4 bg-muted rounded-lg my-2 max-w-md">
      <h3 className="font-semibold text-lg mb-2">Ingredients for {dish}</h3>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-center justify-between border-b pb-2 gap-2">
            <div className="flex items-center gap-2 flex-1"> {/* Group checkbox and name */}
              <Checkbox
                id={`ingredient-${index}`}
                checked={checkedState[index] ?? false} // Use ?? false for safety during initial render
                onCheckedChange={(checked) => handleCheckboxChange(index, checked)}
                aria-label={`Select ingredient ${ingredient.name}`}
              />
              <label htmlFor={`ingredient-${index}`} className="font-medium cursor-pointer">
                {ingredient.name}
              </label>
            </div>
            <span className="text-muted-foreground text-sm whitespace-nowrap"> {/* Ensure quantity/unit don't wrap awkwardly */}
              {ingredient.quantity} {ingredient.unit}
            </span>
          </li>
        ))}
      </ul>
      {/* Buttons container */}
      <div className="mt-4 space-y-2">
        <Button onClick={handleOrder} className="w-full"> 
          Order Selected Ingredients
        </Button>
        <Button onClick={handleAddToCart} variant="outline" className="w-full"> 
          Add Selected to Cart
        </Button>
      </div>
    </div>
  );
};
