import { createOllama } from 'ollama-ai-provider';

// Create an Ollama provider instance with better error handling
const baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/api';

// Create the Ollama provider
export const ollama = createOllama({
  baseURL,
  headers: process.env.OLLAMA_HEADERS ? JSON.parse(process.env.OLLAMA_HEADERS) : {},
});

// Default model to use with Ollama
export const defaultOllamaModel = process.env.OLLAMA_MODEL || 'phi3';

// Check if Ollama is enabled
export const isOllamaEnabled = process.env.USE_OLLAMA === 'true';

// System prompt for Ollama
export const ollamaSystemPrompt = process.env.OLLAMA_SYSTEM_PROMPT || 
  "You are an AI shopping assistant that helps users with questions about products, shopping recommendations, price comparisons, and finding the best deals. Provide helpful, accurate information and suggestions based on the user's needs.";
