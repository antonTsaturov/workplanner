'use client'
import React, { useState, useEffect, useRef } from 'react';
import '../styles/SidePanel.css'
import MonthCalendar from './MonthCalendar'
import { observer } from 'mobx-react';
import { dateStore } from '../store/dateStore';
import { useLocale, useTranslations } from 'next-intl';



const AnimatedProgressBar = observer(({ 
  targetProgress = 0, 
  height = 8,
  completed = '#10B981',
  inProgress = 'linear-gradient(90deg, #3B82F6, #60A5FA, #3B82F6)',
}) => {
  const [progress, setProgress] = useState(0);
  const duration = dateStore.duration;
  
  
  useEffect(() => {
    if (duration > 0.5) {
      const durationPercent = (duration * 100) / 45;
      setProgress(durationPercent)
    } else {
      setProgress(0)
    }
  }, [dateStore.duration]);
  
  
  return (
    <div className="progress-bar-container" style={{ height: `${height}px` }}>
      <div 
        className={`progress-bar-fill ${progress !== 100 ? 'in-progress' : 'completed'}`}
        style={{ 
          width: `${progress}%`,
        }}
      />
    </div>
  );
});

function getWeekNumberISO(date) {
  // Копируем дату, чтобы не менять оригинал
  if (date){
    const d = new Date(Date.UTC(date?.getFullYear(), date.getMonth(), date.getDate()));
    
    // Устанавливаем на четверг этой недели
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    
    // Получаем 1 января
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    
    // Вычисляем номер недели
    const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    
    return weekNumber;
  } else {
    return '';
  }
}


const SidePanel = observer(({ isPanelVisible, children }) => {
  
  const t = useTranslations('sidePanel');
  
  const selectedDate = dateStore.fcDate;
  
  const weekNumber = getWeekNumberISO(selectedDate); // Current weekNumber
  
  const [shouldRender, setShouldRender] = useState(isPanelVisible);

  useEffect(() => {
    if (isPanelVisible) {
      setShouldRender(true);
      
    } else {
      // Wait for animation to complete before removing from DOM
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match this with your animation duration
      
      return () => clearTimeout(timer);
    }
  }, [isPanelVisible]);

  if (!shouldRender) return null;

  return (
    <div className={`side-panel ${isPanelVisible ? 'visible' : 'hidden'}`}>
      
      <MonthCalendar />
      
      <div className="side-panel-progress-container">
        <h5>{t('sidePanelProgressTitle')}</h5>
      </div>
     
      <div className="side-panel-progress-content">
        {t('sidePanelProgressSubTitle')}{` ${weekNumber}`}
      </div>
      
      <AnimatedProgressBar />
    </div>
  );
});

export default SidePanel;
