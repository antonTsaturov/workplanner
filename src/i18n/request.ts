
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

// Define a type for supported locales
type SupportedLocale = 'en' | 'ru';
const supportedLocales: ReadonlyArray<SupportedLocale> = ['en', 'ru'];

// Helper type guard to check if a string is a supported locale
function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (supportedLocales as ReadonlyArray<string>).includes(locale);
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get('locale')?.value;
  console.log(cookieLocale);
  
  // Determine the final locale with type safety
  const finalLocale: SupportedLocale = 
    cookieLocale && isSupportedLocale(cookieLocale) 
      ? cookieLocale 
      : 'en';

  // Import messages with proper typing
  const messages = (await import(`../../public/locales/${finalLocale}.json`)).default;

  return {
    locale: finalLocale,
    messages
  };
});