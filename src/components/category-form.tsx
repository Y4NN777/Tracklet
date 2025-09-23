'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useIntlayer } from 'next-intlayer';

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

const getCategorySchema = (i: any) => z.object({
  name: z.string().min(2, {
    message: i.nameMinLength.key,
  }),
  type: z.enum(['income', 'expense'], {
    required_error: i.typeRequired.key,
  }),
  color: z.string().min(4, {
    message: i.colorRequired.key,
  }),
  icon: z.string().min(1, {
    message: i.iconRequired.key,
  }),
});

type CategoryFormValues = z.infer<ReturnType<typeof getCategorySchema>>

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
  const i = useIntlayer('category-form');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const categorySchema = getCategorySchema(i);

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
          <DialogTitle>{editingCategory ? i.editCategory : i.addCategory}</DialogTitle>
          <DialogDescription>
            {editingCategory ? i.updateCategoryDetails : i.createCategory}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i.categoryName}</FormLabel>
                  <FormControl>
                    <Input placeholder={i.categoryNamePlaceholder.key} {...field} />
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
                  <FormLabel>{i.type}</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="expense">{i.expense}</option>
                      <option value="income">{i.income}</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    {i.typeDescription}
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
                  <FormLabel>{i.icon}</FormLabel>
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
                    {i.iconDescription}
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
                  <FormLabel>{i.color}</FormLabel>
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
                    {i.colorDescription}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                {i.cancel}
              </Button>
              <Button type="submit">
                {editingCategory ? i.updateCategory : i.addCategoryButton}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}