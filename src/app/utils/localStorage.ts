'use client';

export const storage = {
  // Получить данные
  get: <T,>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return defaultValue || null;
    }
  },

  // Сохранить данные
  set: <T,>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Удалить данные
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },

  // Очистить всё
  clear: (): void => {
    if (typeof window === 'undefined') return;
    window.localStorage.clear();
  }
};

// Использование
//export default function Settings() {
  //const saveSettings = () => {
    //storage.set('settings', {
      //theme: 'dark',
      //language: 'ru',
      //notifications: true
    //});
  //};

  //const loadSettings = () => {
    //const settings = storage.get('settings');
    //console.log('Settings:', settings);
  //};
//}
