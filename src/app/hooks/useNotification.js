import { useState, useCallback } from 'react';

let nextId = 0;

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, options = {}) => {
    const id = nextId++;
    const notification = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || 5000,
    };

    setNotifications(prev => [...prev, notification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
};

export default useNotification;
