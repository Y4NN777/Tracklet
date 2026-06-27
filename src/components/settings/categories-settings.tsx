'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PlusCircle,
  Tag,
  Edit,
  Trash2,
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
import { CategoryForm } from '@/components/category-form';
import { MobileDataList } from '@/components/ui/mobile-data-list';
import { api } from '@/lib/api-client';
import { useIntlayer } from 'next-intlayer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const iconComponents = {
  DollarSign, CreditCard, Home, Car, UtensilsCrossed, Film, ShoppingBag, Lightbulb, Stethoscope, BookOpen, Plane, Music, Gamepad2, Monitor, Smartphone, Dumbbell, Circle, Palette, Theater, Pizza, Coffee, Beer, Umbrella, Snowflake, TreePine, Gift, Briefcase, Building, Store
};

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export function CategoriesSettings() {
  const i = useIntlayer('categories-settings-page');
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.getCategories();
      if (response.data) setCategories(response.data.categories || []);
    } catch (error) {
//      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (values: any) => {
    try {
      const response = await api.createCategory(values);
      if (response.data) {
        setCategories(prev => [response.data.category, ...prev]);
        toast({ title: i.categoryAddedToastTitle.key, description: i.categoryAddedToastDescription.key });
      }
    } catch (error) {
      toast({ title: i.errorToastTitle.key, description: i.addCategoryFailed.key, variant: 'destructive' });
    }
  };

  const handleUpdateCategory = async (values: any) => {
    if (!editingCategory) return;
    try {
      const response = await api.updateCategory(editingCategory.id, values);
      if (response.data) {
        setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? response.data.category : cat));
        setEditingCategory(null);
        toast({ title: i.categoryUpdatedToastTitle.key, description: i.categoryUpdatedToastDescription.key });
      }
    } catch (error) {
      toast({ title: i.errorToastTitle.key, description: i.updateCategoryFailed.key, variant: 'destructive' });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await api.deleteCategory(categoryId);
      if (response.data || (!response.error && !response.data)) {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        toast({ title: i.categoryDeletedToastTitle.key, description: i.categoryDeletedToastDescription.key });
      }
    } catch (error) {
      toast({ title: i.errorToastTitle.key, description: i.deleteCategoryFailed.key, variant: 'destructive' });
    }
  };

  const categoriesByType = categories.reduce((acc, category) => {
    if (!acc[category.type]) acc[category.type] = [];
    acc[category.type].push(category);
    return acc;
  }, {} as Record<string, Category[]>);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{i.title}</h3>
        <Button onClick={() => setOpen(true)} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          {i.addCategoryButton}
        </Button>
      </div>

      {Object.entries(categoriesByType).map(([type, typeCategories]) => (
        <div key={type} className="space-y-4">
          <h4 className="font-semibold capitalize">{type === 'income' ? i.incomeCategories.key : i.expenseCategories.key}</h4>
          <MobileDataList
            items={typeCategories}
            type="generic"
            renderCard={(category) => (
              <Card key={category.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: category.color }}>
                      {(() => {
                        const IconComponent = iconComponents[category.icon as keyof typeof iconComponents];
                        return IconComponent ? <IconComponent className="w-4 h-4" /> : <Tag className="w-4 h-4" />;
                      })()}
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingCategory(category); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{i.deleteDialogTitle}</AlertDialogTitle>
                          <AlertDialogDescription>{i.deleteConfirmation.key} "{category.name}"</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{i.cancelButton}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className="bg-destructive hover:bg-destructive/90">{i.deleteButton}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            )}
          />
        </div>
      ))}

      <CategoryForm
        open={open}
        setOpen={setOpen}
        onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
        editingCategory={editingCategory}
        onClose={() => { setOpen(false); setEditingCategory(null); }}
      />
    </div>
  );
}
