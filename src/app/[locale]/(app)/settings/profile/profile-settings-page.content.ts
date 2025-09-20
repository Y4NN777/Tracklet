
import { t, type DeclarationContent } from "intlayer";

const profileSettingsPageContent: DeclarationContent = {
  key: "profile-settings-page",
  content: {
    // Page Header
    title: t({ en: "Profile Settings", fr: "Paramètres du profil" }),

    // Public Profile Card
    publicProfileTitle: t({ en: "Public Profile", fr: "Profil public" }),
    publicProfileDescription: t({ en: "Update your profile information and manage your public presence.", fr: "Mettez à jour les informations de votre profil et gérez votre présence publique." }),
    nameLabel: t({ en: "Name", fr: "Nom" }),
    emailLabel: t({ en: "Email", fr: "Email" }),
    currencyLabel: t({ en: "Currency", fr: "Devise" }),
    saveButton: t({ en: "Save Changes", fr: "Enregistrer les modifications" }),
    savingButton: t({ en: "Saving...", fr: "Enregistrement..." }),

    // Change Password Card
    changePasswordTitle: t({ en: "Change Password", fr: "Changer le mot de passe" }),
    changePasswordDescription: t({ en: "Update your password to keep your account secure.", fr: "Mettez à jour votre mot de passe pour garder votre compte sécurisé." }),
    currentPasswordLabel: t({ en: "Current Password", fr: "Mot de passe actuel" }),
    newPasswordLabel: t({ en: "New Password", fr: "Nouveau mot de passe" }),
    confirmPasswordLabel: t({ en: "Confirm New Password", fr: "Confirmer le nouveau mot de passe" }),
    passwordPlaceholder: t({ en: "••••••••", fr: "••••••••" }),
    updatePasswordButton: t({ en: "Update Password", fr: "Mettre à jour le mot de passe" }),
    updatingButton: t({ en: "Updating...", fr: "Mise à jour..." }),

    // Delete Account Card
    deleteAccountTitle: t({ en: "Delete Account", fr: "Supprimer le compte" }),
    deleteAccountDescription: t({ en: "Permanently remove your account and all associated data.", fr: "Supprimer définitivement votre compte et toutes les données associées." }),
    deleteWarning: t({ en: "Once you delete your account, there is no going back. Please be certain.", fr: "Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. Soyez certain." }),
    deleteAccountButton: t({ en: "Delete Account", fr: "Supprimer le compte" }),

    // Delete Dialog
    deleteDialogTitle: t({ en: "Are you absolutely sure?", fr: "Êtes-vous absolument sûr ?" }),
    deleteDialogDescription: t({ en: "This action cannot be undone. This will permanently delete your account and remove all associated data from our servers.", fr: "Cette action est irréversible. Cela supprimera définitivement votre compte et toutes les données associées de nos serveurs." }),
    cancelButton: t({ en: "Cancel", fr: "Annuler" }),

    // Toasts
    profileUpdatedToastTitle: t({ en: "Profile updated!", fr: "Profil mis à jour !" }),
    profileUpdatedToastDescription: t({ en: "Your profile information has been saved.", fr: "Vos informations de profil ont été enregistrées." }),
    profileUpdateFailed: t({ en: "Failed to update profile. Please try again.", fr: "Échec de la mise à jour du profil. Veuillez réessayer." }),
    passwordMismatch: t({ en: "New passwords do not match.", fr: "Les nouveaux mots de passe ne correspondent pas." }),
    passwordTooShort: t({ en: "Password must be at least 8 characters long.", fr: "Le mot de passe doit contenir au moins 8 caractères." }),
    oauthPasswordChangeTitle: t({ en: "Password Update Not Available", fr: "Mise à jour du mot de passe non disponible" }),
    oauthPasswordChangeDescription: t({ en: "You signed up with OAuth. Use your provider to change password.", fr: "Vous vous êtes inscrit avec OAuth. Utilisez votre fournisseur pour changer de mot de passe." }),
    passwordUpdateFailed: t({ en: "Failed to update password. Please try again.", fr: "Échec de la mise à jour du mot de passe. Veuillez réessayer." }),
    passwordUpdatedToastTitle: t({ en: "Password updated!", fr: "Mot de passe mis à jour !" }),
    passwordUpdatedToastDescription: t({ en: "Your password has been successfully changed.", fr: "Votre mot de passe a été changé avec succès." }),
    unexpectedError: t({ en: "An unexpected error occurred. Please try again.", fr: "Une erreur inattendue est survenue. Veuillez réessayer." }),
    deleteFeatureComingSoon: t({ en: "Feature Coming Soon", fr: "Fonctionnalité bientôt disponible" }),
    deleteFeatureDescription: t({ en: "Account deletion will be available in a future update.", fr: "La suppression de compte sera disponible dans une future mise à jour." }),
    errorToastTitle: t({ en: "Error", fr: "Erreur" }),
  },
};

export default profileSettingsPageContent;
