import React, { useState, useRef } from 'react';
import './ThrowSection.css';

const ThrowSection = () => {
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleThrow = (e) => {
    if (!image || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Apple or tire
    const isApple = Math.random() > 0.5;
    const type = isApple ? '🍏' : '🛞';
    
    setItems(prev => [...prev, {
      id: Date.now() + Math.random(),
      x, y, type,
      rot: Math.random() * 360,
      scale: Math.random() * 2 + 1
    }]);
  };

  return (
    <div className="glass-panel text-center">
      <h2 className="biblical-header">Обряд Бросания (Карание)</h2>
      <p>Загрузи лик грешника и обкидай его яблоками и покрышками на Волгу! Объекты имеют объем и реалистичное падение.</p>
      
      {!image && (
        <label className="upload-label btn-gothic">
          Воздвигнуть Изображение
          <input type="file" accept="image/*" onChange={handleUpload} style={{display: 'none'}} />
        </label>
      )}

      {image && (
        <div className="throw-area" ref={containerRef} onClick={handleThrow}>
          <img src={image} alt="Target" className="target-img" />
          {items.map(it => (
            <div 
              key={it.id} 
              className="thrown-item"
              style={{
                left: it.x, 
                top: it.y, 
                '--rot': `${it.rot}deg`,
                '--endScale': it.scale
              }}
            >
              <div className="item-inner">{it.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThrowSection;
