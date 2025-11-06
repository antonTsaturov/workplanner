import React, { useState, useCallback } from 'react';


export const useModal = () => {
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const open = useCallback(() => {setIsModalOpen(true)},[]);  
  const close = useCallback(() => {setIsModalOpen(false)},[]);  
  
  return {
    isModalOpen,
    open,
    close,
  }
  
}
