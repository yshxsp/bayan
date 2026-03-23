import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import FallingApples from './components/FallingApples'
import HeroApple from './components/HeroApple'
import LoreSection from './components/LoreSection'
import WikiSection from './components/WikiSection'
import AppleCalculator from './components/AppleCalculator'
import GelbooruGallery from './components/GelbooruGallery'
import BayanBook from './components/BayanBook'
import ThrowSection from './components/ThrowSection'
import BayanTimer from './components/BayanTimer'
import BayanHistoryGenerator from './components/BayanHistoryGenerator'
import BayanChronicle from './components/BayanChronicle'

function App() {
  const [entered, setEntered] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioDomRef = useRef(null);

  const enterWorld = () => {
    setEntered(true);
    if (audioDomRef.current) {
      audioDomRef.current.volume = 0.5;
      audioDomRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.log('Альтитуда звука блокирована браузером', e);
        setIsPlaying(false);
      });
    }
  };

  const toggleSound = () => {
    if (!audioDomRef.current) return;
    if (isPlaying) {
      audioDomRef.current.pause();
      setIsPlaying(false);
    } else {
      audioDomRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  if (!entered) {
    const LORE_TEXT_1 = "ВЕЛИКАЯ БОРЬБА ЗА ЯБЛОКИ НАЧАЛАСЬ В СУМСКОМ ЛЕСУ • ЮРИЙ БАЯНОВ РОДИЛСЯ В 2004 • СВЯЩЕННАЯ ПОКРЫШКА И ПРАВЕДНЫЙ ПУТЬ • ".repeat(15);
    const LORE_TEXT_2 = "У ТЯ КАКИЕ ТО СЛАБЫЕ ФРАЗОЧКИ ЕБЛАН ТЕБЯ ПОХОДУ МАТУШКА СРАЗУ УРАНИЛА • СТЕЙК 28/9 ВОССТАНАВЛИВАЕТ СИЛЫ • ДУХИ ЖАЖДУТ ВОЗМЕЗДИЯ • ".repeat(15);
    return (
      <div className="entrance-gate">
        <div className="lore-marquee-container">
          {Array.from({length: 12}).map((_, i) => (
            <div 
              key={i} 
              className={`lore-marquee-line ${i % 2 !== 0 ? 'reverse' : ''}`} 
              style={{ animationDuration: `${60 + i * 5}s` }}
            >
              {i % 2 === 0 ? LORE_TEXT_1 : LORE_TEXT_2}
            </div>
          ))}
        </div>
        <div className="entrance-content">
          <h1 className="biblical-header title-glow">Священный Баяностан</h1>
          <button className="gate-btn" onClick={enterWorld}>Войти во Врата</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <audio ref={audioDomRef} src="/audio1.mp3" loop />
      <FallingApples />
      <div className="app-container" style={{ position: 'relative', zIndex: 10 }}>
        <button onClick={toggleSound} className="sound-toggle-btn" title={isPlaying ? "Выключить святые песнопения" : "Включить святые песнопения"}>
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
        <header style={{textAlign: 'center', margin: '3rem 0', padding: '0 1rem'}}>
          <h1 className="biblical-header" style={{fontSize: '3.5rem'}}>Священный Баяностан</h1>
          <nav className="tab-nav">
            <button className={`tab-btn ${activeTab === 'book' ? 'active' : ''}`} onClick={() => setActiveTab('book')}>Правила Баяна</button>
            <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Летописи Творения</button>
            <button className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>Яблочный Интеллект</button>
            <button className={`tab-btn ${activeTab === 'throw' ? 'active' : ''}`} onClick={() => setActiveTab('throw')}>Обряд Бросания</button>
            <button className={`tab-btn ${activeTab === 'timer' ? 'active' : ''}`} onClick={() => setActiveTab('timer')}>Часы Забвения</button>
            <button className={`tab-btn ${activeTab === 'wiki' ? 'active' : ''}`} onClick={() => setActiveTab('wiki')}>Ложь и Истина</button>
            <button className={`tab-btn ${activeTab === 'calc' ? 'active' : ''}`} onClick={() => setActiveTab('calc')}>Сборы налогов</button>
            <button className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>Святилище Артов</button>
          </nav>
        </header>

        <main className="tab-content">
          {activeTab === 'history' && (
            <div style={{animation: 'fade 0.5s'}}>
              <BayanChronicle />
            </div>
          )}

          {activeTab === 'ai' && (
            <div style={{animation: 'fade 0.5s'}}>
              <BayanHistoryGenerator />
            </div>
          )}

          {activeTab === 'book' && (
            <div style={{animation: 'fade 0.5s'}}>
              <BayanBook />
            </div>
          )}
          
          {activeTab === 'throw' && (
             <div style={{animation: 'fade 0.5s'}}>
               <ThrowSection />
             </div>
          )}
          
          {activeTab === 'timer' && (
             <div style={{animation: 'fade 0.5s'}}>
               <BayanTimer />
             </div>
          )}

          {activeTab === 'wiki' && (
            <div style={{animation: 'fade 0.5s'}}>
               <HeroApple />
               <LoreSection />
               <WikiSection />
            </div>
          )}

          {activeTab === 'calc' && (
            <div style={{animation: 'fade 0.5s'}}>
               <AppleCalculator />
            </div>
          )}

          {activeTab === 'gallery' && (
            <div style={{animation: 'fade 0.5s'}}>
               <GelbooruGallery />
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default App
