import '../styles/SidePanel.css'
import MonthCalendar from './MonthCalendar'
import { observer } from 'mobx-react';
import { dateStore } from '../store/dateStore';


import React, { useState, useEffect, useRef } from 'react';

const AnimatedProgressBar = observer(({ 
  targetProgress = 0, 
  //duration = 1000,
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
  
  //console.log('dfdfdfg: ', dateStore.duration)    
  return (
    <div className="progress-bar-container" style={{ height: `${height}px` }}>
      <div 
        className={`progress-bar-fill ${progress !== 100 ? 'in-progress' : 'completed'}`}
        style={{ 
          width: `${progress}%`,
          //backgroundColor: `${progress === 100 ? completed : inProgress}`
          //backgroundColor: completed
        }}
      />
    </div>
  );
});


const SidePanel = ({ isVisible, children }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      // Wait for animation to complete before removing from DOM
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match this with your animation duration
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div className={`side-panel ${isVisible ? 'visible' : 'hidden'}`}>
      <MonthCalendar />
      <div className="side-panel-stat-container">
        <h5>Workload</h5>
      </div>
      <div className="side-panel-stat-content">
        Week
      </div>
      <AnimatedProgressBar />
    </div>
  );
};

export default SidePanel;
