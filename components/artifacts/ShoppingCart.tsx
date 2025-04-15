import React from 'react';
import { useCartStore } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react'; // Icon for remove button

export const ShoppingCart = () => {
  // Get state and actions from the cart store
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  // Function to handle stagehand API request
  const handleStagehandRequest = async (itemName: string) => {
    try {
      const response = await fetch("/api/stagehand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: itemName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error calling Stagehand API:", errorData);
      }
    } catch (error) {
      console.error("Failed to call Stagehand API:", error);
    }
  };

  // Basic aggregation logic (optional, but good for carts)
  // This groups items by name and sums quantities. Assumes unit is consistent for now.
  const aggregatedItems = items.reduce((acc, item) => {
    const existingItem = acc.find(i => i.name === item.name && i.unit === item.unit);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      // Create a new object to avoid mutating the original store state directly
      acc.push({ ...item }); 
    }
    return acc;
  }, [] as typeof items);


  return (
    <div className="p-4 bg-muted rounded-lg my-2 max-w-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Shopping Cart</h3>
        {aggregatedItems.length > 0 && (
           <Button 
             variant="outline" 
             size="sm" 
             onClick={clearCart}
             aria-label="Clear shopping cart"
           >
             Clear Cart
           </Button>
        )}
      </div>

      {aggregatedItems.length === 0 ? (
        <p className="text-muted-foreground text-sm">Your cart is empty.</p>
      ) : (
        <ul className="space-y-2">
          {aggregatedItems.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex items-center justify-between border-b pb-2 gap-2">
              <div className="flex-1">
                {/* Make item name clickable with POST request to stagehand API */}
                <span 
                  className="font-medium hover:underline cursor-pointer"
                  onClick={() => handleStagehandRequest(item.name)}
                >
                  {item.name}
                </span>
              </div>
              <span className="text-muted-foreground text-sm whitespace-nowrap">
                {item.quantity} {item.unit}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-muted-foreground hover:text-destructive" // Smaller remove button
                onClick={() => removeItem(item.name)}
                aria-label={`Remove ${item.name} from cart`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
       {/* Optionally add a "Proceed to Checkout" button later */}
       {aggregatedItems.length > 0 && (
         <Button className="mt-4 w-full">Proceed to Checkout</Button>
       )}
    </div>
  );
};
