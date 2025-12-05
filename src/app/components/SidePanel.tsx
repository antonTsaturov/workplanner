'use client'
import { useState, useEffect } from 'react';
import '../styles/SidePanel.css'
import MonthCalendar from './MonthCalendar'
import { observer } from 'mobx-react';
import { dateStore } from '../store/dateStore';
import { useTranslations } from 'next-intl';



const AnimatedProgressBar = observer(() => {
  
  const height = 8;
  const [progress, setProgress] = useState(0);
  const duration = dateStore.duration;
  console.log(duration)
  
  useEffect(() => {
    if (duration && duration > 0.5) {
      const durationPercent = (duration * 100) / 45;
      setProgress(durationPercent)
    } else {
      setProgress(0)
    }
  }, [duration]);
  
  
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

function getWeekNumberISO(date: Date) {
  // Копируем дату, чтобы не менять оригинал
  if (date){
    //console.log(typeof date.getMonth === 'function')
    const d = new Date(Date.UTC(date?.getFullYear(), date.getMonth(), date.getDate()));
    //console.log(d)
    // Устанавливаем на четверг этой недели
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    
    // Получаем 1 января
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    
    // Вычисляем разницу в миллисекундах и конвертируем в дни
    const diffInMs = d.getTime() - yearStart.getTime();
    const diffInDays = diffInMs / 86400000;
    
    // Вычисляем номер недели
    const weekNumber = Math.ceil((diffInDays + 1) / 7);
    
    return weekNumber;
  } else {
    return '';
  }
}

const SidePanel = observer(({ isPanelVisible }) => {
  
  const t = useTranslations('sidePanel');
  
  //const selectedDate = new Date(dateStore.fcDate);
  const selectedDate = dateStore.fcDate;
  
  const weekNumber = getWeekNumberISO(selectedDate); // Get current week number
  
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
