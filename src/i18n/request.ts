import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

const supportedLocales = ['en', 'zh'] as const;
type Locale = (typeof supportedLocales)[number];
const defaultLocale: Locale = 'en';

function detectLocale(acceptLanguage: string): Locale {
  const languages = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim().toLowerCase());

  for (const lang of languages) {
    const base = lang.split('-')[0] as Locale;
    if (supportedLocales.includes(base)) {
      return base;
    }
  }

  return defaultLocale;
}

export default getRequestConfig(async () => {
  const headersObj = await headers(); // ✅ await here
  const acceptLanguage = headersObj.get('accept-language') ?? '';

  const locale = detectLocale(acceptLanguage);

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});