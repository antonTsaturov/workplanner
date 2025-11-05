import React, { useEffect, useState } from 'react';
import '../styles/notification.css';

//const Notification = ({ 
  //message, 
  //type = 'info', 
  //duration = 15000, 
  //onClose,
  //id 
//}) => {
  //const [isVisible, setIsVisible] = useState(true);
  //const [isExiting, setIsExiting] = useState(false);

  //useEffect(() => {
    //if (duration > 0) {
      //const timer = setTimeout(() => {
        //handleClose();
      //}, duration);

      //return () => clearTimeout(timer);
    //}
  //}, [duration]);

  //const handleClose = () => {
    //setIsExiting(true);
    //setTimeout(() => {
      //setIsVisible(false);
      //onClose?.(id);
    //}, 300); // Match animation duration
  //};

  //const getIcon = () => {
    //switch (type) {
      //case 'success':
        //return '✓';
      //case 'error':
        //return '✕';
      //case 'warning':
        //return '⚠';
      //case 'info':
      //default:
        //return 'ℹ';
    //}
  //};

  //if (!isVisible) return null;

  //return (
  
    //<div className={`notification notification-${type}`}>
      //<div className="notification-content">
        //<span className="notification-icon">
          //{type === 'success' && '✓'}
          //{type === 'error' && '✕'}
          //{type === 'warning' && '⚠'}
          //{type === 'info' && 'ℹ'}
        //</span>
        //<p className="notification-message">{message}</p>
      //</div>
      //<button 
        //className="notification-close" 
        //onClick={handleClose}
      //>
        //×
      //</button>
    //</div>
    
   

  //);
//};

//export default Notification;


const Notification = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  id,
  style = 'default' // 'default', 'glass', 'frosted', 'transparent', 'dark', 'gradient'
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(id), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(id), 300);
  };

  const getNotificationClass = () => {
    const baseClass = 'notification';
    
    if (style !== 'default') {
      return `${baseClass} notification-${style} notification-${type}`;
    }
    
    return `${baseClass} notification-${type}`;
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={getNotificationClass()}>
      <div className="notification-content">
        <span className="notification-icon">{getIcon()}</span>
        <p className="notification-message">{message}</p>
      </div>
      <button 
        className="notification-close" 
        onClick={handleClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Notification;

  //<div className={`notification notification-${type} ${isExiting ? 'fade-out' : ''}`}>
      //<div className="notification-content">
        //<span className="notification-icon">{getIcon()}</span>
        //<p className="notification-message">{message}</p>
      //</div>
      //<button 
        //className="notification-close" 
        //onClick={handleClose}
        //aria-label="Close notification"
      //>
        //×
      //</button>
    //</div>

