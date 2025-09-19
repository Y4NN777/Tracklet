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
  currency: z.string().describe('The user\'s preferred currency code (e.g., USD, EUR, GBP).'),
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
  prompt: `You are a personal finance advisor for FinTrack, a modern financial management app designed for users in Africa and other emerging markets. Provide personalized, contextual savings recommendations that work within the local financial environment.

  You are providing advice within the FinTrack app ecosystem. Reference the app's specific features and capabilities instead of suggesting external tools or generic apps.

  User Financial Profile:
  - Monthly Income: {{{income}}} {{{currency}}}
  - Monthly Expenses:
  {{#each expenses}}
  - {{{category}}}: {{{amount}}} {{{currency}}}
  {{/each}}
  - Current Savings: {{{savings}}} {{{currency}}}
  - Current Debt: {{{debt}}} {{{currency}}}
  - Financial Goals: {{#each financialGoals}}{{#if @first}}{{this}}{{else}}, {{this}}{{/if}}{{/each}}

  FinTrack App Context:
  - Users can track transactions, set budgets, create savings goals, and monitor spending patterns
  - The app supports multiple currencies and is designed for mobile-first usage
  - Features include transaction categorization, budget alerts, and financial insights
  - Users can set up recurring savings goals and track progress

  African Financial Context Considerations:
  - Many users rely on mobile money services (like MTN Mobile Money, Orange Money, etc.)
  - Consider informal savings methods like community savings groups (tontines, susus)
  - Account for variable income streams and seasonal financial patterns
  - Recognize the importance of family and community financial obligations
  - Consider local banking limitations and mobile money preferences
  - IMPORTANT: Do NOT suggest automated transfers or scheduled transfers as these features do not exist for mobile money in most African countries

  Provide recommendations that:
  - Leverage FinTrack's specific features (budget tracking, goal setting, transaction monitoring)
  - Are practical for African financial systems and mobile money usage
  - Consider cultural and community financial practices
  - Focus on achievable, incremental improvements
  - Account for potentially irregular income patterns
  - Suggest realistic, manual financial habits that work without automation
  - Avoid suggesting automated transfers, scheduled payments, or any automation features that don't exist in the local context
  - Instead, suggest realistic manual methods like:
    * Setting aside a fixed amount after each income receipt
    * Using separate mobile money wallets for savings
    * Participating in community savings groups (tontines, susus)
    * Making conscious daily/weekly savings decisions
    * Using FinTrack to track and remind about savings goals

  Avoid generic Western financial advice that doesn't apply to African contexts.`,
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

