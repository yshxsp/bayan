import React, { useMemo } from 'react';
import './FallingApples.css';

const FallingApples = () => {
  // Generate random properties once to prevent jumpy animations on re-renders (like tab switches)
  const applesConfig = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      left: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 20,
      size: Math.random() * 1.5 + 0.8,
      opacity: Math.random() * 0.3 + 0.1
    }));
  }, []);

  return (
    <div className="falling-apples-container">
      {applesConfig.map((config, i) => (
        <div 
           key={i} 
           className="snowflake-apple" 
           style={{
             left: `${config.left}vw`,
             animationDuration: `${config.duration}s`,
             animationDelay: `-${config.delay}s`,
             fontSize: `${config.size}rem`,
             opacity: config.opacity
           }}
        >
          🍏
        </div>
      ))}
    </div>
  );
};

export default FallingApples;
