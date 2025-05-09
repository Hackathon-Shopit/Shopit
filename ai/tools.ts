import { tool } from 'ai';
import { z } from 'zod';
import { videoRecipeTool } from '@/tools/youtube-recipe-tool';
import { webpageScraperTool } from '@/tools/webpage-scraper-tool';

// Define the ingredient schema to ensure proper typing
const ingredientSchema = z.object({
  name: z.string().describe('The name of the ingredient'),
  quantity: z.number().describe('The quantity of the ingredient'),
  unit: z.string().describe('The unit of measurement for the ingredient (e.g., grams, cups, tablespoons)'),
});

export type Ingredient = z.infer<typeof ingredientSchema>;

// Create a tool for getting recipe ingredients
export const recipeIngredientsTool = tool({
  description: 'Display ingredients needed for a specific dish or recipe',
  parameters: z.object({
    dish: z.string().describe('The name of the dish or recipe'),
    ingredients: z.array(ingredientSchema).describe('List of ingredients required for the dish'),
  }),
  execute: async function ({ dish, ingredients }) {
    // Here, we're just returning the data provided by the model
    return { dish, ingredients };
  },
});

// Create a tool for displaying the shopping cart
export const shoppingCartTool = tool({
  description: 'Display the current contents of the shopping cart.',
  parameters: z.object({}), // No parameters needed from the model
  execute: async function () {
    // The actual cart data will be fetched by the component from the Zustand store.
    // This tool just acts as a trigger for the UI to render the cart component.
    return { status: 'success' }; // Return a simple object
  },
});

// Tool to process Markdown scraped from a webpage
export const processWebpageMarkdown = tool({
  description: 'Processes Markdown from a scraped webpage for AI analysis or summarization.',
  parameters: z.object({
    markdown: z.string().describe('The Markdown content scraped from a webpage.'),
  }),
  // This can be extended to do more with the markdown if needed
  execute: async ({ markdown }) => {
    // For now, just return the markdown for the AI to process
    return { markdown };
  },
});

export const tools = {
  displayRecipeIngredients: recipeIngredientsTool,
  displayShoppingCart: shoppingCartTool,
  video_recipe: videoRecipeTool,
  processWebpageMarkdown,
  webpage_scraper: webpageScraperTool,
};
