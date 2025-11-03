import '../styles/SidePanel.css'
import MonthCalendar from './MonthCalendar'

import React, { useState, useEffect } from 'react';

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
      <div className="progress-bar-animated">
        <div className="progress-fill" style={{width:'6%'}}></div>
      </div>
    </div>
  );
};

export default SidePanel;
