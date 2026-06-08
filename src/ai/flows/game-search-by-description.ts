'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Genkit flow for natural language game discovery
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

export async function gameSearchByDescription(
  input: GameSearchByDescriptionInput
): Promise<GameSearchByDescriptionOutput> {
  return gameSearchByDescriptionFlow(input);
}

const gameSearchByDescriptionPrompt = ai.definePrompt({
  name: 'gameSearchByDescriptionPrompt',
  input: {schema: GameSearchByDescriptionInputSchema},
  output: {schema: GameSearchByDescriptionOutputSchema},
  prompt: `You are an AI assistant specialized in recommending video games. Your task is to analyze a user's natural language description of a desired game and provide highly relevant game suggestions.

First, extract key characteristics, genres, and themes from the user's description and list them as keywords.

Then, based on these keywords, suggest three distinct, imaginative, and highly relevant game titles. For each suggested game, provide a plausible name, its genre, and a brief summary that matches the input description.

User's desired game description: {{{description}}}`,
});

const gameSearchByDescriptionFlow = ai.defineFlow(
  {
    name: 'gameSearchByDescriptionFlow',
    inputSchema: GameSearchByDescriptionInputSchema,
    outputSchema: GameSearchByDescriptionOutputSchema,
  },
  async input => {
    const {output} = await gameSearchByDescriptionPrompt(input);
    return output!;
  }
);