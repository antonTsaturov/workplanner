import { useLocale, useTranslations } from 'next-intl';
import { setSessionLang } from '../lib/session';


export function useLangSwitcher() {
  
  const currentLocale = useLocale();
  
  const switchLanguage = () => {
    if (currentLocale === 'en' ) setSessionLang('ru'); else setSessionLang('en');
  };
  
  return {switchLanguage};
}
