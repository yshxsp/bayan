import React, { useState, useRef, useEffect } from 'react';
import './ThrowSection.css';
import { Target, Apple, Zap, Sparkles } from 'lucide-react';

const ThrowSection = () => {
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [image, setImage] = useState(null);
  const containerRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleThrow = (e) => {
    if (!image) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newItem = {
      id: Date.now(),
      x,
      y,
      rotation: Math.random() * 360,
      type: Math.random() > 0.5 ? 'apple' : 'tire'
    };

    setItems(prev => [...prev, newItem]);
    setScore(prev => prev + 10);
    
    // Эффект встряски
    containerRef.current.classList.add('shaking');
    setTimeout(() => {
      containerRef.current.classList.remove('shaking');
    }, 200);
  };

  return (
    <section className="throw-section">
      <div className="glass-panel throw-controls">
        <h2 className="biblical-header text-gradient">Обряд Бросания</h2>
        <p>Загрузи лик неверного (или червивого прораба) и закидай его святыми артефактами.</p>
        
        <label className="upload-target-btn">
          <Target size={20} />
          <span>Выбрать Цель</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
        </label>

        <div className="score-board">
          <Sparkles size={20} className="gold" />
          <span>Святая Ярость: {score}</span>
        </div>
      </div>

      {image && (
        <div className="throw-area" ref={containerRef} onClick={handleThrow}>
          <img src={image} alt="Священная Цель" className="target-img" loading="lazy" />
          {items.map(it => (
            <div 
              key={it.id} 
              className={`thrown-item ${it.type}`}
              style={{ 
                left: it.x, 
                top: it.y, 
                transform: `translate(-50%, -50%) rotate(${it.rotation}deg)` 
              }}
            >
              {it.type === 'apple' ? '🍎' : '🛞'}
            </div>
          ))}
        </div>
      )}

      {!image && (
        <div className="empty-throw glass-panel">
          <Apple size={60} style={{ opacity: 0.1 }} />
          <p>Алтарь пуст. Призови кого-нибудь для заклевывания.</p>
        </div>
      )}
    </section>
  );
};

export default ThrowSection;
