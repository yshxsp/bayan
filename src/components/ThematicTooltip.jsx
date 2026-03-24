import React from 'react';
import './ThematicTooltip.css';

const ThematicTooltip = ({ text, children }) => {
  return (
    <div className="thematic-tooltip-container">
      {children}
      <div className="thematic-tooltip-content">
        <span className="tooltip-sparkle">✨</span>
        {text}
      </div>
    </div>
  );
};

export default ThematicTooltip;
