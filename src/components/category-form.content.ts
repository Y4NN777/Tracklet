import { t, type DeclarationContent } from "intlayer";

const categoryFormContent: DeclarationContent = {
  key: "category-form",
  content: {
    // Zod Schema
    nameMinLength: t({ en: "Category name must be at least 2 characters.", fr: "Le nom de la catégorie doit comporter au moins 2 caractères." }),
    typeRequired: t({ en: "Please select a category type.", fr: "Veuillez sélectionner un type de catégorie." }),
    colorRequired: t({ en: "Please select a color.", fr: "Veuillez sélectionner une couleur." }),
    iconRequired: t({ en: "Please select an icon.", fr: "Veuillez sélectionner une icône." }),

    // Dialog
    editCategory: t({ en: "Edit Category", fr: "Modifier la catégorie" }),
    addCategory: t({ en: "Add Category", fr: "Ajouter une catégorie" }),
    updateCategoryDetails: t({ en: "Update your category details.", fr: "Mettez à jour les détails de votre catégorie." }),
    createCategory: t({ en: "Create a new category to organize your transactions.", fr: "Créez une nouvelle catégorie pour organiser vos transactions." }),

    // Form Fields
    categoryName: t({ en: "Category Name", fr: "Nom de la catégorie" }),
    categoryNamePlaceholder: t({ en: "e.g., Food & Dining", fr: "ex: Nourriture et restaurants" }),
    type: t({ en: "Type", fr: "Type" }),
    expense: t({ en: "Expense", fr: "Dépense" }),
    income: t({ en: "Income", fr: "Revenu" }),
    typeDescription: t({ en: "Choose whether this is an income or expense category.", fr: "Choisissez s'il s'agit d'une catégorie de revenus ou de dépenses." }),
    icon: t({ en: "Icon", fr: "Icône" }),
    iconDescription: t({ en: "Choose an icon to represent this category.", fr: "Choisissez une icône pour représenter cette catégorie." }),
    color: t({ en: "Color", fr: "Couleur" }),
    colorDescription: t({ en: "Choose a color for this category.", fr: "Choisissez une couleur pour cette catégorie." }),

    // Buttons
    cancel: t({ en: "Cancel", fr: "Annuler" }),
    updateCategory: t({ en: "Update Category", fr: "Mettre à jour la catégorie" }),
    addCategoryButton: t({ en: "Add Category", fr: "Ajouter la catégorie" }),
  },
};

export default categoryFormContent;
