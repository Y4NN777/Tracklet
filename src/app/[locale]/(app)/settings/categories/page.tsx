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

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  created_at: string;
}

export default function CategoriesPage() {
  const i = useIntlayer('categories-settings-page');
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.getCategories();

      if (response.data) {
        setCategories(response.data.categories || []);
      } else if (response.error) {
//        console.error('Error fetching categories:', response.error);
      }
    } catch (error) {
//      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (values: any) => {
    try {
      const response = await api.createCategory(values);

      if (response.data) {
        setCategories(prev => [response.data.category, ...prev]);
        toast({
          title: i.categoryAddedToastTitle,
          description: i.categoryAddedToastDescription,
        });
      } else if (response.error) {
//        console.error('Failed to add category:', response.error);
        toast({
          title: i.errorToastTitle,
          description: i.addCategoryFailed,
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error adding category:', error);
      toast({
        title: i.errorToastTitle,
        description: i.addCategoryFailed,
        variant: 'destructive',
      });
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleUpdateCategory = async (values: any) => {
    if (!editingCategory) return;

    try {
      const response = await api.updateCategory(editingCategory.id, values);

      if (response.data) {
        setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? response.data.category : cat));
        setEditingCategory(null);
        toast({
          title: i.categoryUpdatedToastTitle,
          description: i.categoryUpdatedToastDescription,
        });
      } else if (response.error) {
//        console.error('Failed to update category:', response.error);
        toast({
          title: i.errorToastTitle,
          description: i.updateCategoryFailed,
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error updating category:', error);
      toast({
        title: i.errorToastTitle,
        description: i.updateCategoryFailed,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await api.deleteCategory(categoryId);

      if (response.data || (!response.error && !response.data)) {
        // DELETE returns 204 No Content, so no data but success
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        toast({
          title: i.categoryDeletedToastTitle,
          description: i.categoryDeletedToastDescription,
        });
      } else if (response.error) {
//        console.error('Failed to delete category:', response.error);
        toast({
          title: i.errorToastTitle,
          description: i.deleteCategoryFailed,
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error deleting category:', error);
      toast({
        title: i.errorToastTitle,
        description: i.deleteCategoryFailed,
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
  };

  // Group categories by type
  const categoriesByType = categories.reduce((acc, category) => {
    if (!acc[category.type]) acc[category.type] = [];
    acc[category.type].push(category);
    return acc;
  }, {} as Record<string, Category[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{i.title}</CardTitle>
            <CardDescription>{i.loadingDescription}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Tag className="h-6 w-6" />
              {i.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {i.description}
            </p>
          </div>
          <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            {i.addCategoryButton}
          </Button>
        </div>

        {/* Categories by Type */}
        {Object.entries(categoriesByType).map(([type, typeCategories]) => (
          <div key={type} className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold capitalize">{typeof i.categoriesTitle === 'function' ? i.categoriesTitle({ type }) : `${type} Categories`}</h2>
              <span className="text-sm text-muted-foreground">
                {typeof i.categoryCount === 'function' ? i.categoryCount({ count: typeCategories.length }) : `(${typeCategories.length} categor${typeCategories.length !== 1 ? 'ies' : 'y'})`}
              </span>
            </div>

            <MobileDataList
              items={typeCategories}
              type="generic"
              renderCard={(category) => (
                <Card key={category.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {(() => {
                            const IconComponent = iconComponents[category.icon as keyof typeof iconComponents];
                            return IconComponent ? <IconComponent className="w-4 h-4" /> : <Tag className="w-4 h-4" />;
                          })()}
                        </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {category.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{i.deleteDialogTitle}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {typeof i.deleteDialogDescription === 'function' ? i.deleteDialogDescription({ name: category.name }) : `Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{i.cancelButton}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {i.deleteButton}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              )}
              emptyState={{
                title: typeof i.emptyGroupTitle === 'function' ? i.emptyGroupTitle({ type }) : `No ${type} categories`,
                description: typeof i.emptyGroupDescription === 'function' ? i.emptyGroupDescription({ type }) : `Add your first ${type} category to get started.`,
              }}
            />
          </div>
        ))}

        {/* Empty state when no categories at all */}
        {categories.length === 0 && (
          <Card>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                <Tag className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">{i.emptyTitle}</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {i.emptyDescription}
                </p>
                <Button onClick={() => setOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {i.addFirstCategoryButton}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <CategoryForm
        open={open}
        setOpen={setOpen}
        onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
        editingCategory={editingCategory}
        onClose={handleClose}
      />
    </>
  );
}