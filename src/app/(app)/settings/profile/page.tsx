'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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

export default function ProfilePage() {
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

  // Load user data on mount - only if user is available
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        email: user.email || '',
        avatarUrl: user.user_metadata?.avatar_url || '',
      });
    }
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
      // Update preferences using the working hook
      await updatePreferences({
        currency: preferences.currency,
      });

      // Update profile-specific data (name, avatar)
      const profileUpdates: any = {
        full_name: profile.name,
      };

      // Handle avatar upload if there's a new file
      if (newAvatarFile) {
        // Upload to Supabase Storage
        const fileExt = newAvatarFile.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, newAvatarFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        profileUpdates.avatar_url = publicUrl;
        setProfile(prev => ({ ...prev, avatarUrl: publicUrl }));
        setNewAvatarFile(null);
        setPreviewAvatarUrl(null);
      }

      // Update profile in database
      if (Object.keys(profileUpdates).length > 0) {
        await db.updateUserProfile(user.id, profileUpdates);
      }

      toast({
        title: 'Profile updated!',
        description: 'Your profile information has been saved.',
      });
    } catch (err) {
      console.error('Profile update error:', err);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      setIsPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      setIsPasswordLoading(false);
      return;
    }

    try {
      // TODO: Implement actual password change with Supabase
      // For now, simulate password change
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Password updated!',
        description: 'Your password has been successfully changed.',
      });

      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to change password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: Implement actual account deletion with Supabase
      // For now, simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Account deleted',
        description: 'Your account has been successfully deleted.',
      });

      // TODO: Implement actual sign out and redirect to login page
      // For now, we'll just show a message
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profile Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>
            Update your profile information and manage your public presence.
          </CardDescription>
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
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isSaving || prefsLoading}
                />
              </Label>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-lg font-medium">{profile.name}</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={isSaving || prefsLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={isSaving || prefsLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={preferences.currency}
                onChange={(e) => updatePreferences({ currency: e.target.value })}
                disabled={isSaving || prefsLoading}
              >
                {/* Major Global Reserve Currencies */}
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CHF">CHF - Swiss Franc</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CNY">CNY - Chinese Yuan</option>

                {/* European Currencies */}
                <option value="SEK">SEK - Swedish Krona</option>
                <option value="NOK">NOK - Norwegian Krone</option>
                <option value="DKK">DKK - Danish Krone</option>
                <option value="PLN">PLN - Polish Złoty</option>
                <option value="CZK">CZK - Czech Koruna</option>
                <option value="HUF">HUF - Hungarian Forint</option>
                <option value="RON">RON - Romanian Leu</option>
                <option value="BGN">BGN - Bulgarian Lev</option>
                <option value="HRK">HRK - Croatian Kuna</option>
                <option value="ISK">ISK - Icelandic Króna</option>

                {/* North American Currencies */}
                <option value="MXN">MXN - Mexican Peso</option>

                {/* South American Currencies */}
                <option value="BRL">BRL - Brazilian Real</option>
                <option value="ARS">ARS - Argentine Peso</option>
                <option value="CLP">CLP - Chilean Peso</option>
                <option value="COP">COP - Colombian Peso</option>
                <option value="PEN">PEN - Peruvian Sol</option>
                <option value="UYU">UYU - Uruguayan Peso</option>
                <option value="PYG">PYG - Paraguayan Guarani</option>
                <option value="BOB">BOB - Bolivian Boliviano</option>
                <option value="VES">VES - Venezuelan Bolívar</option>

                {/* Asian Currencies */}
                <option value="INR">INR - Indian Rupee</option>
                <option value="KRW">KRW - South Korean Won</option>
                <option value="SGD">SGD - Singapore Dollar</option>
                <option value="HKD">HKD - Hong Kong Dollar</option>
                <option value="TWD">TWD - New Taiwan Dollar</option>
                <option value="THB">THB - Thai Baht</option>
                <option value="MYR">MYR - Malaysian Ringgit</option>
                <option value="IDR">IDR - Indonesian Rupiah</option>
                <option value="PHP">PHP - Philippine Peso</option>
                <option value="VND">VND - Vietnamese Dong</option>
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="BDT">BDT - Bangladeshi Taka</option>
                <option value="LKR">LKR - Sri Lankan Rupee</option>
                <option value="NPR">NPR - Nepalese Rupee</option>
                <option value="MMK">MMK - Myanmar Kyat</option>
                <option value="KHR">KHR - Cambodian Riel</option>
                <option value="LAK">LAK - Lao Kip</option>

                {/* Middle East & Central Asian Currencies */}
                <option value="SAR">SAR - Saudi Riyal</option>
                <option value="AED">AED - UAE Dirham</option>
                <option value="QAR">QAR - Qatari Riyal</option>
                <option value="KWD">KWD - Kuwaiti Dinar</option>
                <option value="BHD">BHD - Bahraini Dinar</option>
                <option value="OMR">OMR - Omani Rial</option>
                <option value="JOD">JOD - Jordanian Dinar</option>
                <option value="ILS">ILS - Israeli Shekel</option>
                <option value="TRY">TRY - Turkish Lira</option>
                <option value="EGP">EGP - Egyptian Pound</option>
                <option value="MAD">MAD - Moroccan Dirham</option>
                <option value="TND">TND - Tunisian Dinar</option>
                <option value="DZD">DZD - Algerian Dinar</option>
                <option value="LYD">LYD - Libyan Dinar</option>
                <option value="SDG">SDG - Sudanese Pound</option>
                <option value="SYP">SYP - Syrian Pound</option>
                <option value="IQD">IQD - Iraqi Dinar</option>
                <option value="IRR">IRR - Iranian Rial</option>
                <option value="YER">YER - Yemeni Rial</option>
                <option value="AZN">AZN - Azerbaijani Manat</option>
                <option value="KZT">KZT - Kazakhstani Tenge</option>
                <option value="UZS">UZS - Uzbekistani Som</option>
                <option value="TJS">TJS - Tajikistani Somoni</option>
                <option value="TMT">TMT - Turkmenistani Manat</option>
                <option value="AFN">AFN - Afghan Afghani</option>

                {/* African Currencies */}
                <option value="ZAR">ZAR - South African Rand</option>
                <option value="NGN">NGN - Nigerian Naira</option>
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="TZS">TZS - Tanzanian Shilling</option>
                <option value="UGX">UGX - Ugandan Shilling</option>
                <option value="RWF">RWF - Rwandan Franc</option>
                <option value="BIF">BIF - Burundian Franc</option>
                <option value="ETB">ETB - Ethiopian Birr</option>
                <option value="GHS">GHS - Ghanaian Cedi</option>
                <option value="XOF">XOF - West African CFA Franc</option>
                <option value="XAF">XAF - Central African CFA Franc</option>
                <option value="CDF">CDF - Congolese Franc</option>
                <option value="MGA">MGA - Malagasy Ariary</option>
                <option value="MUR">MUR - Mauritian Rupee</option>
                <option value="SCR">SCR - Seychellois Rupee</option>
                <option value="MWK">MWK - Malawian Kwacha</option>
                <option value="ZMW">ZMW - Zambian Kwacha</option>
                <option value="BWP">BWP - Botswana Pula</option>
                <option value="SZL">SZL - Swazi Lilangeni</option>
                <option value="LSL">LSL - Lesotho Loti</option>
                <option value="NAD">NAD - Namibian Dollar</option>
                <option value="MZN">MZN - Mozambican Metical</option>
                <option value="AOA">AOA - Angolan Kwanza</option>
                <option value="CVE">CVE - Cape Verdean Escudo</option>
                <option value="STN">STN - São Tomé and Príncipe Dobra</option>
                <option value="GMD">GMD - Gambian Dalasi</option>
                <option value="SLL">SLL - Sierra Leonean Leone</option>
                <option value="LRD">LRD - Liberian Dollar</option>

                {/* Oceania Currencies */}
                <option value="NZD">NZD - New Zealand Dollar</option>
                <option value="FJD">FJD - Fijian Dollar</option>
                <option value="TOP">TOP - Tongan Paʻanga</option>
                <option value="WST">WST - Samoan Tala</option>
                <option value="VUV">VUV - Vanuatu Vatu</option>
                <option value="SBD">SBD - Solomon Islands Dollar</option>
                <option value="PGK">PGK - Papua New Guinean Kina</option>

                {/* Cryptocurrencies (for completeness) */}
                <option value="BTC">BTC - Bitcoin</option>
                <option value="ETH">ETH - Ethereum</option>
                <option value="USDT">USDT - Tether</option>
                <option value="BNB">BNB - Binance Coin</option>
                <option value="ADA">ADA - Cardano</option>
                <option value="SOL">SOL - Solana</option>
                <option value="DOT">DOT - Polkadot</option>
                <option value="DOGE">DOGE - Dogecoin</option>
                <option value="AVAX">AVAX - Avalanche</option>
                <option value="MATIC">MATIC - Polygon</option>
              </select>
            </div>
            <Button type="submit" disabled={isSaving || prefsLoading}>
              {isSaving || prefsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                disabled={isPasswordLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                disabled={isPasswordLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                disabled={isPasswordLoading}
              />
            </div>
            <Button type="submit" disabled={isPasswordLoading}>
              {isPasswordLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Permanently remove your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}