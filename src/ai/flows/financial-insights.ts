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
  currency: z.string().describe('The user\'s preferred currency code (e.g., USD, EUR, GBP).'),
  locale: z.string().describe('The user\'s preferred language (e.g., en, fr).'),
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
  prompt: `You are a personal finance advisor for Tracklet, a modern financial management app designed for users in Africa and other emerging markets. Analyze the user's financial data and provide contextual, practical insights that consider their local financial environment.

  You are providing advice within the Tracklet app, so reference the app's features instead of suggesting external tools. Consider the African context where banking systems, mobile money, and financial habits may differ from Western norms.

  Please provide your response in the following language: {{{locale}}}.

  User Financial Data:
  - Monthly Income: {{{income}}} {{{currency}}}
  - Monthly Expenses:
  {{#each expenses}}
  - {{{category}}}: {{{amount}}} {{{currency}}}
  {{/each}}
  - Current Savings: {{{savings}}} {{{currency}}}
  - Current Debt: {{{debt}}} {{{currency}}}
  - Financial Goals: {{#each financialGoals}}{{#if @first}}{{this}}{{else}}, {{this}}{{/if}}{{/each}}

  Key Context for Advice:
  - This user is using Tracklet, which has features for transaction tracking, budgeting, savings goals, and financial insights
  - Consider African financial context: mobile money prevalence, informal economies, variable income streams, community/family financial obligations
  - Focus on practical, actionable advice that works within local financial systems
  - Reference Tracklet's features like transaction categorization, budget tracking, and goal setting
  - IMPORTANT: Do NOT suggest automated transfers, scheduled payments, or any automation features that don't exist in African mobile money systems

  Provide insights that are:
  - Culturally relevant to African users
  - Practical for users with potentially irregular income
  - Focused on Tracklet's capabilities rather than external tools
  - Realistic about local financial constraints and opportunities
  - Free of unrealistic automation suggestions
  - Suggest practical manual savings methods like community groups, separate wallets, or conscious daily savings habits

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
