'use server';
/**
 * @fileOverview AI-powered financial insights flow.
 *
 * - getFinancialInsights - A function that generates financial insights based on user data.
 * - FinancialInsightsInput - The input type for the getFinancialInsights function.
 * - FinancialInsightsOutput - The return type for the getFinancialInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialInsightsInputSchema = z.object({
  income: z.number().describe('The user\'s monthly income.'),
  expenses: z.array(z.object({
    category: z.string().describe('The category of the expense.'),
    amount: z.number().describe('The amount spent on the expense.'),
  })).describe('A list of the user\'s expenses.'),
  savings: z.number().describe('The user\'s total savings.'),
  debt: z.number().describe('The user\'s total debt.'),
  financialGoals: z.array(z.string()).describe('A list of the user\'s financial goals.'),
});
export type FinancialInsightsInput = z.infer<typeof FinancialInsightsInputSchema>;

const FinancialInsightsOutputSchema = z.object({
  spendingPatterns: z.string().describe('Insights on the user\'s spending patterns.'),
  potentialSavings: z.string().describe('Potential savings opportunities for the user.'),
  investmentOpportunities: z.string().describe('Potential investment opportunities for the user.'),
});
export type FinancialInsightsOutput = z.infer<typeof FinancialInsightsOutputSchema>;

export async function getFinancialInsights(input: FinancialInsightsInput): Promise<FinancialInsightsOutput> {
  return financialInsightsFlow(input);
}

const financialInsightsPrompt = ai.definePrompt({
  name: 'financialInsightsPrompt',
  input: {schema: FinancialInsightsInputSchema},
  output: {schema: FinancialInsightsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user\'s financial data and provide insights on their spending patterns, potential savings opportunities, and investment opportunities.

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

  Provide the insights in a clear and concise manner.

  Spending Patterns: {{spendingPatterns}}
  Potential Savings: {{potentialSavings}}
  Investment Opportunities: {{investmentOpportunities}}`,
});

const financialInsightsFlow = ai.defineFlow(
  {
    name: 'financialInsightsFlow',
    inputSchema: FinancialInsightsInputSchema,
    outputSchema: FinancialInsightsOutputSchema,
  },
  async input => {
    const {output} = await financialInsightsPrompt(input);
    return output!;
  }
);
