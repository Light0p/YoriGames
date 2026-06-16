/**
 * @fileOverview Refactored AI flow for static export compatibility.
 * 
 * - personalizedGameRecommendations - A client-side function that calls an external API.
 * - PersonalizedGameRecommendationsInput - The input type for the function.
 * - PersonalizedGameRecommendationsOutput - The return type for the function.
 */

import { z } from 'zod';

const PersonalizedGameRecommendationsInputSchema = z.object({
  playHistory: z
    .array(z.string())
    .describe('A list of game titles the user has played.'),
});
export type PersonalizedGameRecommendationsInput = z.infer<
  typeof PersonalizedGameRecommendationsInputSchema
>;

const PersonalizedGameRecommendationsOutputSchema = z.object({
  quirkyGenreTags: z
    .array(z.string())
    .describe('A list of quirky and creative genre tags based on play history.'),
  recommendedGames: z
    .array(z.string())
    .describe('A list of game titles recommended based on play history.'),
});
export type PersonalizedGameRecommendationsOutput = z.infer<
  typeof PersonalizedGameRecommendationsOutputSchema
>;

/**
 * Standard client-side function for personalized recommendations.
 * In a static export environment, this calls an external API endpoint.
 */
export async function personalizedGameRecommendations(
  input: PersonalizedGameRecommendationsInput
): Promise<PersonalizedGameRecommendationsOutput> {
  try {
    const response = await fetch('/api/ai/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`AI Recommendation Uplink Failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to execute AI recommendations:', error);
    // Return a fallback structure for static environments
    return {
      quirkyGenreTags: [],
      recommendedGames: []
    };
  }
}
