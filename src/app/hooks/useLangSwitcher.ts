import { useLocale, useTranslations } from 'next-intl';
import { setSessionLang } from '../lib/session';


export function useLangSwitcher() {
  
  const currentLocale = useLocale();
  
  const switchLanguage = () => {
    currentLocale === 'en' ? setSessionLang('ru') : setSessionLang('en');
    };
  
  return {switchLanguage};
}
