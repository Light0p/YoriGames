'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized game recommendations.
 *
 * - personalizedGameRecommendations - A function that analyzes user play history and suggests dynamic, quirky genre tags and game recommendations.
 * - PersonalizedGameRecommendationsInput - The input type for the personalizedGameRecommendations function.
 * - PersonalizedGameRecommendationsOutput - The return type for the personalizedGameRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

export async function personalizedGameRecommendations(
  input: PersonalizedGameRecommendationsInput
): Promise<PersonalizedGameRecommendationsOutput> {
  return personalizedGameRecommendationsFlow(input);
}

const personalizedGameRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedGameRecommendationsPrompt',
  input: {schema: PersonalizedGameRecommendationsInputSchema},
  output: {schema: PersonalizedGameRecommendationsOutputSchema},
  prompt: `You are an expert game recommendation AI, specializing in unique and quirky suggestions.
Analyze the user's play history below and generate:
1. A list of dynamic, quirky, and creative genre tags that best describe the user's preferences, going beyond standard genres.
2. A list of highly relevant game recommendations based on their play history, that they might enjoy. Focus on lesser-known gems or unique takes on familiar styles.

User's Play History:
{{#each playHistory}}- {{this}}
{{/each}}`,
});

const personalizedGameRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedGameRecommendationsFlow',
    inputSchema: PersonalizedGameRecommendationsInputSchema,
    outputSchema: PersonalizedGameRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedGameRecommendationsPrompt(input);
    return output!;
  }
);
