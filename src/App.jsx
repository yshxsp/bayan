import React, { useState } from 'react'
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

function App() {
  const [entered, setEntered] = useState(false);
  const [activeTab, setActiveTab] = useState('history');

  const enterWorld = () => {
    setEntered(true);
    // Autoplay audio on entry
    const audio = new Audio('/audio1.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Альтитуда звука блокирована браузером'));
  };

  if (!entered) {
    return (
      <div className="entrance-gate">
        <h1 className="biblical-header" style={{fontSize: '4rem', marginBottom: '2rem'}}>Священный Баяностан</h1>
        <button className="gate-btn" onClick={enterWorld}>Войти во Врата</button>
      </div>
    );
  }

  return (
    <>
      <FallingApples />
      <div className="app-container" style={{ position: 'relative', zIndex: 10 }}>
        <header style={{textAlign: 'center', margin: '3rem 0', padding: '0 1rem'}}>
          <h1 className="biblical-header" style={{fontSize: '3.5rem'}}>Священный Баяностан</h1>
          <nav className="tab-nav">
            <button className={`tab-btn ${activeTab === 'book' ? 'active' : ''}`} onClick={() => setActiveTab('book')}>Завет Баяна</button>
            <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Летописи (ИИ)</button>
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
