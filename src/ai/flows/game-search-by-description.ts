/**
 * @fileOverview Refactored AI flow for static export compatibility.
 * 
 * - gameSearchByDescription - A client-side function that calls an external API.
 * - GameSearchByDescriptionInput - The input type for the function.
 * - GameSearchByDescriptionOutput - The return type for the function.
 */

import { z } from 'zod';

const GameSearchByDescriptionInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A natural language description of the type of game the user is looking for (e.g., "nighttime cosmic runner").'
    ),
});
export type GameSearchByDescriptionInput = z.infer<
  typeof GameSearchByDescriptionInputSchema
>;

const GameSearchByDescriptionOutputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe('A list of keywords or tags extracted from the description.'),
  suggestedGames: z
    .array(
      z.object({
        name: z.string().describe('The name of the suggested game.'),
        genre: z.string().describe('The genre of the suggested game.'),
        summary:
          z.string().describe('A brief summary or description of the game.'),
      })
    )
    .describe('A list of highly relevant game suggestions based on the description.'),
});
export type GameSearchByDescriptionOutput = z.infer<
  typeof GameSearchByDescriptionOutputSchema
>;

/**
 * Standard client-side function for game search.
 * In a static export environment, this calls an external API endpoint.
 */
export async function gameSearchByDescription(
  input: GameSearchByDescriptionInput
): Promise<GameSearchByDescriptionOutput> {
  try {
    const response = await fetch('/api/ai/game-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`AI Search Uplink Failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to execute AI game search:', error);
    // Return a fallback structure to prevent UI crashes in the static build
    return {
      keywords: [],
      suggestedGames: []
    };
  }
}
