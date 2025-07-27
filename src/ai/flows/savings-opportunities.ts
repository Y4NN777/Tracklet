// SavingsOpportunities flow

'use server';

/**
 * @fileOverview Provides AI-powered savings opportunities based on user's financial data.
 *
 * - getSavingsOpportunities - A function that analyzes spending patterns and provides savings recommendations.
 * - SavingsOpportunitiesInput - The input type for the getSavingsOpportunities function.
 * - SavingsOpportunitiesOutput - The return type for the getSavingsOpportunities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SavingsOpportunitiesInputSchema = z.object({
  income: z.number().describe('The user\'s monthly income.'),
  expenses: z.array(z.object({
    category: z.string().describe('The category of the expense.'),
    amount: z.number().describe('The amount spent on the expense.'),
  })).describe('A list of the user\'s expenses.'),
  savings: z.number().describe('The user\'s total savings.'),
  debt: z.number().describe('The user\'s total debt.'),
  financialGoals: z.array(z.string()).describe('A list of the user\'s financial goals.'),
});
export type SavingsOpportunitiesInput = z.infer<typeof SavingsOpportunitiesInputSchema>;

const SavingsOpportunitiesOutputSchema = z.object({
  savingsOpportunities: z
    .string()
    .describe('A list of potential savings opportunities and recommendations.'),
});
export type SavingsOpportunitiesOutput = z.infer<typeof SavingsOpportunitiesOutputSchema>;

export async function getSavingsOpportunities(input: SavingsOpportunitiesInput): Promise<SavingsOpportunitiesOutput> {
  return savingsOpportunitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'savingsOpportunitiesPrompt',
  input: {schema: SavingsOpportunitiesInputSchema},
  output: {schema: SavingsOpportunitiesOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's financial data and provide personalized savings opportunities and recommendations.

Income: {{{income}}}
Expenses:
{{#each expenses}}
- Category: {{{category}}}, Amount: {{{amount}}}
{{/each}}
Savings: {{{savings}}}
Debt: {{{debt}}}
Financial Goals:
{{#each financialGoals}}
- {{{this}}}
{{/each}}

Provide clear and actionable steps the user can take to improve their savings rate and achieve their financial goals faster.`,
});

const savingsOpportunitiesFlow = ai.defineFlow(
  {
    name: 'savingsOpportunitiesFlow',
    inputSchema: SavingsOpportunitiesInputSchema,
    outputSchema: SavingsOpportunitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

