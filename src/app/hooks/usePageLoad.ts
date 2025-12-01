import { useEffect, useState} from 'react';

export function usePageLoad() {
  
  const [pageIsLoad, setPageIsLoad] = useState(false);
  
  useEffect(() => {
    const handleLoad = () => {
      setPageIsLoad(true)
      console.log('usePageLoad: Страница полностью загружена');
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);
  
  return {pageIsLoad};
}
