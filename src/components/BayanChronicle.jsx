import React, { useState, useEffect } from 'react';
import { chronicleData } from '../data/chronicle';
import { ArrowUp, List, X } from 'lucide-react';

const BayanChronicle = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Back to top visibility
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }

      // Scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      element.classList.add('active-highlight');
      setIsTocOpen(false); // Close mobile ToC after click
      setTimeout(() => {
        element.classList.remove('active-highlight');
      }, 2000);
    }
  };

  return (
    <section className="chronicle-wrapper">
      {/* Индикатор прогресса чтения */}
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* Кнопки управления (Вертикальный стек справа) */}
      <div className="chronicle-controls">
        <button 
          onClick={() => setIsTocOpen(!isTocOpen)}
          className={`control-btn toc-toggle ${isTocOpen ? 'active' : ''}`}
          title="Открыть карту времен"
        >
          {isTocOpen ? <X size={24} /> : <List size={24} />}
        </button>
        
        <button 
          onClick={scrollToTop}
          className={`control-btn floating-top-btn ${showScroll ? 'visible' : ''}`}
          title="Вознестись к истокам"
        >
          <ArrowUp size={24} />
        </button>
      </div>

      {/* Оглавление (Боковая панель) */}
      <aside className={`chronicle-toc-sidebar glass-panel ${isTocOpen ? 'open' : ''}`}>
        <div className="toc-header">
          <h2 className="biblical-header toc-title" style={{ textAlign: 'left', margin: 0, fontSize: '1.2rem' }}>Карта Времен</h2>
          <button className="close-toc" onClick={() => setIsTocOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div className="toc-list-scroll">
          {chronicleData.map((event) => (
            <a 
              key={event.id} 
              href={`#${event.id}`} 
              onClick={(e) => handleScrollTo(e, event.id)}
              className="toc-item-link"
            >
              <span className="toc-year-tag">{event.year.split(' ')[0]}</span>
              <span className="toc-label-text">{event.title}</span>
            </a>
          ))}
        </div>
      </aside>

      {/* Затемнение при открытом оглавлении на мобилках */}
      {isTocOpen && <div className="toc-overlay" onClick={() => setIsTocOpen(false)}></div>}

      <header className="chronicle-main-header">
        <h2 className="biblical-header text-gradient main-title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Великая Летопись Баяностана</h2>
        <p className="thematic-subtitle" style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '1.2rem' }}>От сотворения первой покрышки до вечного глянца</p>
      </header>

      {/* Основной список записей */}
      <div className="chronicle-list">
        {chronicleData.map((era) => (
          <article 
            key={era.year} 
            id={era.id} 
            className="glass-panel chronicle-card" 
          >
            <div className="era-indicator"></div>
            
            <div className="era-header" style={{ marginBottom: '1.5rem' }}>
              <span className="era-year" style={{ 
                fontWeight: 800, 
                fontSize: '1.4rem', 
                color: 'var(--apple-green)', 
                background: 'rgba(74, 222, 128, 0.1)', 
                padding: '6px 18px', 
                borderRadius: '30px', 
                border: '1px solid rgba(74, 222, 128, 0.2)' 
              }}>
                {era.year}
              </span>
            </div>
            
            <h3 className="biblical-header era-title" style={{ 
              fontSize: '2.2rem', 
              marginBottom: '1.5rem', 
              color: '#fff', 
              letterSpacing: '0.05em', 
              textAlign: 'left' 
            }}>
              {era.title}
            </h3>
            
            <div className="article-content-wrapper" style={{ maxWidth: '800px' }}>
              <p className="era-text" style={{ 
                color: '#ffffff', 
                fontSize: '1.25rem', 
                lineHeight: '1.8', 
                textAlign: 'left',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                {era.text}
              </p>
            </div>
          </article>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .chronicle-wrapper {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          padding: 0 1rem;
        }

        .chronicle-main-header {
          text-align: center;
          margin-bottom: 4rem;
          padding-top: 2rem;
        }

        .scroll-progress-container {
          position: fixed;
          top: var(--header-height);
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(0,0,0,0.2);
          z-index: 1400;
        }

        .scroll-progress-bar {
          height: 100%;
          background: var(--apple-green);
          box-shadow: 0 0 10px var(--apple-green);
          transition: width 0.1s ease-out;
        }

        .chronicle-controls {
          position: fixed;
          bottom: 7rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 1400;
        }

        .control-btn {
          width: 50px;
          height: 50px;
          background: rgba(17, 17, 17, 0.9);
          border: 1px solid var(--gold);
          color: var(--gold);
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        }

        .control-btn:hover {
          transform: scale(1.1);
          border-color: var(--apple-green);
          color: var(--apple-green);
          box-shadow: 0 5px 20px rgba(55, 235, 61, 0.3);
        }

        .control-btn.active {
          background: var(--apple-green);
          color: #000;
          border-color: var(--apple-green);
        }

        .floating-top-btn {
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
        }

        .floating-top-btn.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .chronicle-toc-sidebar {
          position: fixed;
          top: 100px;
          right: 2rem;
          width: 300px;
          max-height: calc(100vh - 250px);
          z-index: 1300;
          padding: 1.5rem;
          transform: translateX(calc(100% + 5rem));
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          background: rgba(17,17,17,0.95);
          backdrop-filter: blur(10px);
          border: 1px solid var(--gold);
          border-radius: 12px;
        }

        .chronicle-toc-sidebar.open {
          transform: translateX(0);
        }

        .toc-list-scroll {
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-right: 0.5rem;
        }

        .toc-item-link {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.6rem;
          text-decoration: none;
          color: #ccc;
          border-radius: 8px;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .toc-item-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--apple-green);
          transform: translateX(5px);
        }

        .toc-year-tag {
          background: rgba(74, 222, 128, 0.1);
          color: var(--apple-green);
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.75rem;
          min-width: 50px;
          text-align: center;
        }

        .toc-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 1250;
        }

        .chronicle-list {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          margin-top: 2rem;
          max-width: 900px;
        }

        .chronicle-card {
          padding: 3rem;
          position: relative;
          background: rgba(17, 17, 17, 0.95); /* More opaque */
          border-left: 4px solid var(--apple-green);
          scroll-margin-top: 100px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }

        .era-text {
          color: #ffffff !important;
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
        }

        .era-indicator {
          position: absolute;
          left: -4px;
          top: 3rem;
          width: 4px;
          height: 40px;
          background: #fff;
          box-shadow: 0 0 15px #fff;
        }

        .active-highlight {
          border-left-color: #fff !important;
          box-shadow: 0 0 30px rgba(55, 235, 61, 0.5) !important;
          transform: scale(1.02);
        }

        @media (max-width: 768px) {
          .chronicle-card {
            padding: 1.5rem;
          }
          .era-title {
            font-size: 1.6rem !important;
          }
          .chronicle-toc-sidebar {
            width: 85%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            max-height: 80vh;
            transition: all 0.3s ease; /* Faster transition */
          }
          .chronicle-toc-sidebar.open {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
          }
        }
      `}} />
    </section>
  );
};

export default BayanChronicle;
