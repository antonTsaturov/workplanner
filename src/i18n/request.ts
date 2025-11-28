import {getRequestConfig} from 'next-intl/server';
import { cookies } from 'next/headers'
import { getSessionLang } from '../app/lib/session'


export default getRequestConfig(async ({requestLocale}) => {
  
  const supportedLocales = ['en', 'ru'];
  const store = await cookies();
  const locale = store.get('locale')?.value;
  console.log(locale)
  //const locale = requestLocale || 'en';
  
  
  const finalLocale = supportedLocales.includes(locale) ? locale : 'en';

  return {
    locale: finalLocale,
    messages: (await import(`../../public/locales/${finalLocale}.json`)).default
  };
});
