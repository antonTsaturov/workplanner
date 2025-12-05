'use client'

import React, { useEffect, useState,  } from 'react';

import '../globals.css';

interface ModalProps {
  isOpen: boolean;
  onClose?: (subaction?: string) => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  
  const [isVisible, setIsVisible] = useState(false);


  const handleOverlayClick = () => {
    onClose?.('overlay');
  }

  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onClose?.('close');
  };


  useEffect(() => {
    if (isOpen) {
      // Trigger animation after component mounts
      setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setIsVisible(false), 10);
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.('close');
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen && !isVisible) return null;
  

  return (
    <div className={`modal-overlay ${isVisible ? 'modal-open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          ×
        </button>
        
        {children}
        
      </div>
    </div>
  );
};

export default Modal;