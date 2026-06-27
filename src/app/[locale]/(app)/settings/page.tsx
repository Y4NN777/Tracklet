'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Tag } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { PreferencesSettings } from "@/components/settings/preferences-settings";
import { CategoriesSettings } from "@/components/settings/categories-settings";

export default function SettingsPage() {
  const i = useIntlayer('settings-page');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{i.settingsTitle || 'Settings'}</h1>
        <p className="text-muted-foreground mt-1">
          {i.settingsDescription || 'Manage your account settings and preferences.'}
        </p>
      </div>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{i.preferencesTitle}</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{i.profileTitle || 'Profile'}</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">{i.categories || 'Categories'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preferences">
          <PreferencesSettings />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
