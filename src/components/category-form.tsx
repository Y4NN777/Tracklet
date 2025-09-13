'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DollarSign,
  CreditCard,
  Home,
  Car,
  UtensilsCrossed,
  Film,
  ShoppingBag,
  Lightbulb,
  Stethoscope,
  BookOpen,
  Plane,
  Music,
  Gamepad2,
  Monitor,
  Smartphone,
  Dumbbell,
  Circle,
  Palette,
  Theater,
  Pizza,
  Coffee,
  Beer,
  Umbrella,
  Snowflake,
  TreePine,
  Gift,
  Briefcase,
  Building,
  Store
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categorySchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  type: z.enum(['income', 'expense'], {
    required_error: "Please select a category type.",
  }),
  color: z.string().min(4, {
    message: "Please select a color.",
  }),
  icon: z.string().min(1, {
    message: "Please select an icon.",
  }),
});

type CategoryFormValues = z.infer<typeof categorySchema>

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

interface CategoryFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: CategoryFormValues) => void;
  editingCategory?: Category | null;
  onClose?: () => void;
}

const iconComponents = {
  DollarSign,
  CreditCard,
  Home,
  Car,
  UtensilsCrossed,
  Film,
  ShoppingBag,
  Lightbulb,
  Stethoscope,
  BookOpen,
  Plane,
  Music,
  Gamepad2,
  Monitor,
  Smartphone,
  Dumbbell,
  Circle,
  Palette,
  Theater,
  Pizza,
  Coffee,
  Beer,
  Umbrella,
  Snowflake,
  TreePine,
  Gift,
  Briefcase,
  Building,
  Store
};

const predefinedIcons = Object.keys(iconComponents);

const predefinedColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e', '#64748b', '#6b7280', '#374151'
];

export function CategoryForm({ open, setOpen, onSubmit, editingCategory, onClose }: CategoryFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: 'expense',
      color: '#6366f1',
      icon: '📊',
    },
  })

  // Reset form when dialog opens/closes or editing category changes
  useEffect(() => {
    if (open) {
      if (editingCategory) {
        form.reset({
          name: editingCategory.name,
          type: editingCategory.type,
          color: editingCategory.color,
          icon: editingCategory.icon,
        });
      } else {
        form.reset({
          name: "",
          type: 'expense',
          color: '#6366f1',
          icon: '📊',
        });
      }
    }
  }, [open, editingCategory, form]);

  function handleClose() {
    form.reset();
    setOpen(false);
    onClose?.();
  }

  function onSubmitHandler(values: CategoryFormValues) {
    onSubmit(values);
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogDescription>
            {editingCategory ? 'Update your category details.' : 'Create a new category to organize your transactions.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Food & Dining" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Choose whether this is an income or expense category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-10 gap-2 p-3 border rounded-md">
                      {predefinedIcons.map((iconName) => {
                        const IconComponent = iconComponents[iconName as keyof typeof iconComponents];
                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => field.onChange(iconName)}
                            className={`w-8 h-8 rounded flex items-center justify-center hover:bg-accent ${
                              field.value === iconName ? 'bg-accent ring-2 ring-ring' : ''
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Choose an icon to represent this category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-10 gap-2 p-3 border rounded-md">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => field.onChange(color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            field.value === color ? 'border-foreground' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Choose a color for this category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? 'Update Category' : 'Add Category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}