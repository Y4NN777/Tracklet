import { t, type DeclarationContent } from "intlayer";

const profileSettingsPageContent: DeclarationContent = {
  key: "profile-settings-page",
  content: {
    title: t({ en: "Profile Settings", fr: "Paramètres du profil" }),
    publicProfileTitle: t({ en: "Public Profile", fr: "Profil public" }),
    publicProfileDescription: t({ en: "This information will be displayed publicly.", fr: "Ces informations seront affichées publiquement." }),
    nameLabel: t({ en: "Name", fr: "Nom" }),
    emailLabel: t({ en: "Email", fr: "E-mail" }),
    currencyLabel: t({ en: "Preferred Currency", fr: "Devise préférée" }),
    saveButton: t({ en: "Save Changes", fr: "Enregistrer les modifications" }),
    savingButton: t({ en: "Saving...", fr: "Enregistrement..." }),
    profileUpdatedToastTitle: t({ en: "Profile updated", fr: "Profil mis à jour" }),
    profileUpdatedToastDescription: t({ en: "Your profile has been successfully updated.", fr: "Votre profil a été mis à jour avec succès." }),
    errorToastTitle: t({ en: "Error", fr: "Erreur" }),
    profileUpdateFailed: t({ en: "Failed to update profile.", fr: "Échec de la mise à jour du profil." }),
    changePasswordTitle: t({ en: "Change Password", fr: "Changer le mot de passe" }),
    changePasswordDescription: t({ en: "Update your account password.", fr: "Mettez à jour le mot de passe de votre compte." }),
    currentPasswordLabel: t({ en: "Current Password", fr: "Mot de passe actuel" }),
    newPasswordLabel: t({ en: "New Password", fr: "Nouveau mot de passe" }),
    confirmPasswordLabel: t({ en: "Confirm New Password", fr: "Confirmer le nouveau mot de passe" }),
    passwordPlaceholder: t({ en: "••••••••", fr: "••••••••" }),
    updatePasswordButton: t({ en: "Update Password", fr: "Mettre à jour le mot de passe" }),
    updatingButton: t({ en: "Updating...", fr: "Mise à jour..." }),
    passwordUpdatedToastTitle: t({ en: "Password updated", fr: "Mot de passe mis à jour" }),
    passwordUpdatedToastDescription: t({ en: "Your password has been successfully updated.", fr: "Votre mot de passe a été mis à jour avec succès." }),
    passwordMismatch: t({ en: "Passwords do not match.", fr: "Les mots de passe ne correspondent pas." }),
    passwordTooShort: t({ en: "Password must be at least 8 characters.", fr: "Le mot de passe doit comporter au moins 8 caractères." }),
  },
};

export default profileSettingsPageContent;
