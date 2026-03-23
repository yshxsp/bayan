import React from 'react';
import { chronicleData } from '../data/chronicle';
import { ArrowUp } from 'lucide-react';

const BayanChronicle = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Плавный скролл к центру
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Добавляем класс подсветки
      element.classList.add('active-highlight');
      setTimeout(() => {
        element.classList.remove('active-highlight');
      }, 2000);
    }
  };

  return (
    <div className="chronicle-wrapper" style={{ margin: '0 auto', maxWidth: '1000px', width: '100%', padding: '0 1rem' }}>
      {/* Оглавление */}
      <div className="glass-panel" id="toc" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h2 className="biblical-header text-gradient" style={{ fontSize: '2rem', textAlign: 'center' }}>Оглавление Летописей</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
          gap: '0.5rem', 
          marginTop: '1rem' 
        }}>
          {chronicleData.map((event) => (
            <a 
              key={event.id} 
              href={`#${event.id}`} 
              onClick={(e) => handleScrollTo(e, event.id)}
              className="toc-link"
              style={{ 
                fontSize: '0.85rem', 
                color: 'var(--apple-green)', 
                textDecoration: 'none',
                padding: '4px 8px',
                background: 'rgba(100, 255, 0, 0.05)',
                borderRadius: '4px',
                textAlign: 'center',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              {event.year}
            </a>
          ))}
        </div>
      </div>

      {/* Основной список записей */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {chronicleData.map((event) => (
          <div 
            key={event.id} 
            id={event.id} 
            className="glass-panel chronicle-card" 
            style={{ 
              padding: '2rem', 
              position: 'relative',
              borderLeft: '4px solid var(--apple-green)',
              animation: 'slideIn 0.5s ease-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: '1.2rem', 
                color: 'var(--apple-green)',
                background: 'rgba(100, 255, 0, 0.1)',
                padding: '4px 12px',
                borderRadius: '20px'
              }}>
                {event.year}
              </span>
              <button 
                onClick={scrollToTop}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem'
                }}
                className="hover-bright"
              >
                <ArrowUp size={14} /> Наверх
              </button>
            </div>
            
            <h3 className="biblical-header" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>
              {event.title}
            </h3>
            
            <p style={{ 
              lineHeight: '1.8', 
              fontSize: '1.1rem', 
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'justify',
              fontFamily: "'Inter', sans-serif"
            }}>
              {event.desc}
            </p>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .toc-link:hover {
          background: rgba(100, 255, 0, 0.2) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(100, 255, 0, 0.1);
        }
        .chronicle-card {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, background 0.5s ease;
          scroll-margin-top: 100px;
        }
        .chronicle-card:hover {
          transform: translateX(10px);
          box-shadow: 0 10px 40px rgba(100, 255, 0, 0.15);
        }
        .active-highlight {
          background: rgba(100, 255, 0, 0.15) !important;
          box-shadow: 0 0 50px rgba(100, 255, 0, 0.2);
          transform: scale(1.02) translateX(10px);
          border-left-width: 8px !important;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hover-bright:hover {
          color: #fff !important;
        }
      `}} />
    </div>
  );
};

export default BayanChronicle;
