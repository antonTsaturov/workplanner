'use client';

export const storage = {
  // Получить 
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

  // Сохранить 
  set: <T,>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Удалить 
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