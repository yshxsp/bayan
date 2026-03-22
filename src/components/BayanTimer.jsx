import React, { useState, useEffect } from 'react';
import './BayanTimer.css';

const BayanTimer = () => {
  // Баянов в лесу до 69 лет. Допустим, таймер ведет отсчет его земного пути.
  // 69 лет в секундах: 69 * 365 * 24 * 3600 = 2176056000
  const [timeLeft, setTimeLeft] = useState(2176056000);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const shortenLife = () => {
    setTimeLeft(prev => prev - 1); // Кнопка, убирающая по одной секунде
  };

  return (
    <div className="glass-panel text-center">
      <h2 className="biblical-header">Песочные Часы Баянова</h2>
      <p>Каждая секунда приближает 69-летие Юрия Баянова в темном Сумском Лесу. Ускорь его судьбу.</p>
      
      <div className="time-display" style={{ fontSize: '3rem', margin: '2rem 0', fontFamily: 'monospace', color: 'var(--apple-red)' }}>
        {timeLeft.toLocaleString()} <span style={{fontSize: '1rem'}}>сек.</span>
      </div>
      
      <button className="punish-btn btn-gothic" onClick={shortenLife}>Ускорить Забвение (-1 секунда)</button>
    </div>
  );
};

export default BayanTimer;
