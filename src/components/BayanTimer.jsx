import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './BayanTimer.css';

const TOTAL_CYCLE = 1488 * 3600 + 8 * 60 + 8; // 1488 hours, 8 mins, 8 secs
const EPOCH = 1704067200000; // Fixed epoch for global synchronization

const BayanTimer = () => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_CYCLE);
  const [exploding, setExploding] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - EPOCH) / 1000);
      const rem = TOTAL_CYCLE - (elapsed % TOTAL_CYCLE);
      setTimeLeft(rem);
      
      // Trigger explosion precisely on reset
      if (rem === TOTAL_CYCLE) {
        triggerExplosion();
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerExplosion = () => {
    if (exploding) return;
    setExploding(true);
    setTimeout(() => {
      setExploding(false);
    }, 20000); // Massive 20-second effect
  };

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="glass-panel text-center timer-wrapper">
      <h2 className="biblical-header text-gradient">Часы Откровения Баянова</h2>
      <p>Синхронизированный обратный отсчет до перерождения.</p>
      
      <div className="time-display">
        <div className="time-block">
          <span className="time-val">{hours}</span>
          <span className="time-label">ЧАСОВ</span>
        </div>
        <span className="time-sep">:</span>
        <div className="time-block">
          <span className="time-val">{minutes.toString().padStart(2, '0')}</span>
          <span className="time-label">МИНУТ</span>
        </div>
        <span className="time-sep">:</span>
        <div className="time-block">
          <span className="time-val">{seconds.toString().padStart(2, '0')}</span>
          <span className="time-label">СЕКУНД</span>
        </div>
      </div>
      
      <button className="punish-btn btn-gothic" onClick={triggerExplosion}>[ДЕБАГ] Ускорить Время (Вызвать финал)</button>

      {exploding && createPortal(
        <div className="explosion-overlay">
          <div className="madness-text">
            "у тя какие то слабые фразочки еблан тебя походу матушка на свет родила да и сразу же уранила позже твоя матуха остасывала всем народу причмокивая его хуц а тебя унижали и ставили на колени перед духами и ебали прямо в очко а из этого очка тебе делали стейк который хуяришь 28/9 в итоге ты свое уматузи засунул и лишился детвености ебанатише"
          </div>
          {Array.from({ length: 150 }).map((_, i) => (
            <div 
              key={i} 
              className="exploding-apple"
              style={{
                '--delay': `${Math.random() * 2}s`,
                '--startX': `${Math.random() * 100}vw`,
                '--startY': `${Math.random() * 100}vh`,
                '--endX': `${(Math.random() - 0.5) * 200}vw`,
                '--endY': `${(Math.random() - 0.5) * 200}vh`,
                '--rot': `${Math.random() * 720}deg`,
                '--scale': `${Math.random() * 3 + 0.5}`
              }}
            >
              🍎
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default BayanTimer;
