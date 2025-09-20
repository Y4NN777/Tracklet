'use client';

import { useLocale } from 'next-intlayer';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getLocalizedUrl, Locales } from 'intlayer';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const router = useRouter();

  const handleLocaleChange = (newLocale: 'en' | 'fr') => {
    // This will update the cookie that stores the locale
    setLocale(newLocale);
    // This will navigate to the localized URL
    router.push(getLocalizedUrl(window.location.pathname, newLocale as Locales));
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={locale === 'en' ? 'default' : 'outline'}
        onClick={() => handleLocaleChange('en')}
        disabled={locale === 'en'}
      >
        EN
      </Button>
      <Button
        size="sm"
        variant={locale === 'fr' ? 'default' : 'outline'}
        onClick={() => handleLocaleChange('fr')}
        disabled={locale === 'fr'}
      >
        FR
      </Button>
    </div>
  );
}