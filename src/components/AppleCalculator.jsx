import React, { useState } from 'react';
import './AppleCalculator.css';

const AppleCalculator = () => {
  const [fiat, setFiat] = useState('');
  const [hours, setHours] = useState('');
  const [result, setResult] = useState(null);

  const calculateTax = () => {
    const fiatVal = parseFloat(fiat) || 0;
    const hoursVal = parseFloat(hours) || 0;

    // Секретная формула Сумской области: 
    // 1 час работы = 2.5 Яблока
    // 1000 единиц фиата = 1 Яблоко
    const totalApples = (hoursVal * 2.5) + (fiatVal / 1000);
    // Налог - 13% от собранного урожая, но не меньше 1 яблока
    const tax = Math.max(1, totalApples * 0.13);

    setResult({
      total: totalApples.toFixed(2),
      tax: tax.toFixed(2),
      net: Math.max(0, totalApples - tax).toFixed(2)
    });
  };

  return (
    <section className="calculator-section">
      <div className="glass-panel text-center">
        <h2 className="text-gradient hover-effect">Калькулятор Яблочных Налогов</h2>
        <p>Узнайте, сколько антоновки вы должны в казну Баяностана за свои грехи и капитал.</p>
        
        <div className="calc-inputs">
          <input 
            type="number" 
            placeholder="Заработано фиата (у.е.)" 
            value={fiat}
            onChange={(e) => setFiat(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Отработано часов на стройке (с мастерком)" 
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <button onClick={calculateTax}>Собрать Урожай</button>
        </div>

        {result && (
          <div className="calc-results">
            <p>🍏 Всего заработано: <strong>{result.total} яблок</strong></p>
            <p className="tax">🍎 Налог Великой Руслане: <strong>{result.tax} яблок</strong></p>
            <p>🍏 Чистый остаток: <strong>{result.net} яблок</strong></p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppleCalculator;
