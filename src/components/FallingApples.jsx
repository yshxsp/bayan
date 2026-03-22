import React from 'react';
import './FallingApples.css';

const FallingApples = () => {
  // 40 apples for a nice snowflake effect
  const apples = Array.from({ length: 40 }); 

  return (
    <div className="falling-apples-container">
      {apples.map((_, i) => {
        const leftPos = Math.random() * 100;
        const animDur = Math.random() * 15 + 10;
        const animDel = Math.random() * 20;
        const size = Math.random() * 1.5 + 0.8;
        const opac = Math.random() * 0.3 + 0.1;
        
        return (
          <div 
             key={i} 
             className="snowflake-apple" 
             style={{
               left: `${leftPos}vw`,
               animationDuration: `${animDur}s`,
               animationDelay: `-${animDel}s`, // Negative delay makes them already falling on load
               fontSize: `${size}rem`,
               opacity: opac
             }}
          >
            🍏
          </div>
        );
      })}
    </div>
  );
};

export default FallingApples;
