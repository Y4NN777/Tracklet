"use server";

import { getFinancialInsights, FinancialInsightsOutput } from "@/ai/flows/financial-insights";
import { z } from "zod";

const InsightsSchema = z.object({
  income: z.coerce.number().min(0, "Income must be a positive number."),
  savings: z.coerce.number().min(0, "Savings must be a positive number."),
  debt: z.coerce.number().min(0, "Debt must be a positive number."),
  financialGoals: z.string().min(5, "Please describe your financial goals."),
  expenses: z.array(z.object({
    category: z.string().min(1),
    amount: z.coerce.number().min(0.01),
  })).min(1, "Please add at least one expense."),
  currency: z.string().min(1, "Currency is required."),
});

export type InsightsState = {
  form: z.infer<typeof InsightsSchema>;
  error?: string;
  result?: FinancialInsightsOutput;
};

export async function getFinancialInsightsAction(
  prevState: InsightsState,
  formData: FormData
): Promise<InsightsState> {
//  console.log('🔍 getFinancialInsightsAction called with form data');

  const expenseCategories = formData.getAll('expenseCategory');
  const expenseAmounts = formData.getAll('expenseAmount');

  const expenses = expenseCategories.map((category, index) => ({
    category: category as string,
    amount: parseFloat(expenseAmounts[index] as string),
  })).filter(e => e.category && !isNaN(e.amount) && e.amount > 0);

  const formValues = {
    income: formData.get("income"),
    savings: formData.get("savings"),
    debt: formData.get("debt"),
    financialGoals: formData.get("financialGoals"),
    expenses,
    currency: formData.get("currency") || "USD",
  };

  const validatedFields = InsightsSchema.safeParse(formValues);

  if (!validatedFields.success) {
    const firstError = validatedFields.error.errors[0];
    const errorPath = firstError.path.join('.');
    return {
      form: prevState.form,
      error: `${errorPath}: ${firstError.message}`,
    };
  }

  try {
    const aiInput = {
      ...validatedFields.data,
      financialGoals: validatedFields.data.financialGoals.split('\n').filter(g => g.trim() !== ''),
      currency: validatedFields.data.currency,
    }
    const result = await getFinancialInsights(aiInput);
    return {
      form: validatedFields.data,
      result: result,
    };
  } catch (e) {
//    console.error('❌ AI Error:', e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return {
      form: validatedFields.data,
      error: `AI Error: ${errorMessage}. Please check your API key and try again.`,
    };
  }
}
