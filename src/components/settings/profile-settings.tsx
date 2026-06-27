'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePreferences } from '@/hooks/use-preferences';
import { auth, db, supabase } from '@/lib/supabase';
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
import { useIntlayer } from 'next-intlayer';

export function ProfileSettings() {
  const i = useIntlayer('profile-settings-page');
  const { toast } = useToast();
  const { preferences, updatePreferences, isLoading: prefsLoading, isLoggedIn, user } = usePreferences();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatarUrl: '',
  });
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        try {
          const { data: dbProfile } = await db.getUserProfile(user.id);
          setProfile({
            name: dbProfile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || '',
            email: user.email || '',
            avatarUrl: dbProfile?.avatar_url || user.user_metadata?.avatar_url || '',
          });
        } catch (error) {
          setProfile({
            name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            email: user.email || '',
            avatarUrl: user.user_metadata?.avatar_url || '',
          });
        }
      }
    };
    loadProfileData();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatarFile(file);
      setPreviewAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isLoggedIn) return;
    setIsSaving(true);
    try {
      const profileUpdates: any = {};
      if (profile.name && profile.name !== user.user_metadata?.full_name) {
        profileUpdates.full_name = profile.name;
      }
      if (newAvatarFile) {
        const fileExt = newAvatarFile.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('Tracklet-avatars')
          .upload(fileName, newAvatarFile, { cacheControl: '3600', upsert: true });
        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
        const { data: { publicUrl } } = supabase.storage.from('Tracklet-avatars').getPublicUrl(fileName);
        profileUpdates.avatar_url = publicUrl;
        setProfile(prev => ({ ...prev, avatarUrl: publicUrl }));
        setNewAvatarFile(null);
        setPreviewAvatarUrl(null);
      }
      if (Object.keys(profileUpdates).length > 0) {
        await db.updateUserProfile(user.id, profileUpdates);
      }
      toast({
        title: i.profileUpdatedToastTitle.key,
        description: i.profileUpdatedToastDescription.key,
      });
    } catch (err) {
      toast({
        title: i.errorToastTitle.key,
        description: err instanceof Error ? err.message : i.profileUpdateFailed.key,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: i.errorToastTitle.key, description: i.passwordMismatch.key, variant: 'destructive' });
      setIsPasswordLoading(false);
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast({ title: i.errorToastTitle.key, description: i.passwordTooShort.key, variant: 'destructive' });
      setIsPasswordLoading(false);
      return;
    }
    try {
      const { error } = await auth.updatePassword(passwordData.newPassword);
      if (error) throw error;
      toast({ title: i.passwordUpdatedToastTitle.key, description: i.passwordUpdatedToastDescription.key });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast({ title: i.errorToastTitle.key, description: i.passwordUpdateFailed.key, variant: 'destructive' });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{i.publicProfileTitle}</CardTitle>
          <CardDescription>{i.publicProfileDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={previewAvatarUrl || profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-2 text-primary-foreground hover:bg-primary/90">
                <Camera className="h-4 w-4" />
                <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </Label>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-lg font-medium">{profile.name}</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{i.nameLabel}</Label>
              <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} disabled={isSaving} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">{i.currencyLabel}</Label>
              <select
                id="currency"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={preferences.currency}
                onChange={(e) => updatePreferences({ currency: e.target.value })}
                disabled={isSaving || prefsLoading}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="XOF">XOF - West African CFA Franc</option>
              </select>
            </div>
            <Button type="submit" disabled={isSaving}>{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : i.saveButton}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{i.changePasswordTitle}</CardTitle>
          <CardDescription>{i.changePasswordDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">{i.newPasswordLabel}</Label>
              <Input id="new-password" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} disabled={isPasswordLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{i.confirmPasswordLabel}</Label>
              <Input id="confirm-password" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} disabled={isPasswordLoading} />
            </div>
            <Button type="submit" disabled={isPasswordLoading}>{isPasswordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : i.updatePasswordButton}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
