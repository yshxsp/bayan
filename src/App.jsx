import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Radio } from 'lucide-react'
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
import DonationSection from './components/DonationSection'
import AuthModal from './components/AuthModal'
import AppHeader from './components/AppHeader'
import ChatModule from './components/ChatModule'
import ProfileSection from './components/ProfileSection'
import { supabase } from './supabaseClient'
import { useSettings } from './hooks/useSettings'
import './components/EntranceStyles.css'

const RADIO_PLAYLIST = [
  '/audio/audio1.mp3',
  '/audio/audio2.mp3',
  '/audio/audio3.mp3'
];

function App() {
  const [settings, setSettings] = useSettings();
  const [entered, setEntered] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioDomRef = useRef(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        // Ensure profile exists and set online status
        await supabase.from('profiles').upsert({ 
          id: currentUser.id, 
          status: 'online',
          username: currentUser.user_metadata?.username || currentUser.email.split('@')[0],
          updated_at: new Date().toISOString()
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const playCrunch = () => {
    if (!settings.sound) return;
    // Note: /audio/crunch.mp3 should be placed in public/audio/
    const crunch = new Audio('/audio/crunch.mp3');
    crunch.volume = 0.4;
    crunch.play().catch(() => {});
    
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  const handleTabChange = (tabId) => {
    playCrunch();
    setActiveTab(tabId);
  };

  const handleLogout = async () => {
    if (user) {
      await supabase.from('profiles').update({ status: 'offline' }).eq('id', user.id);
    }
    await supabase.auth.signOut();
  };

  const enterWorld = () => {
    setEntered(true);
    // Auto-play disabled per user request
  };

  const toggleSound = () => {
    if (!audioDomRef.current) return;
    const newState = !settings.sound;
    setSettings('sound', newState);
    
    if (newState) {
      audioDomRef.current.volume = 0.5;
      audioDomRef.current.play().catch(() => {});
    } else {
      audioDomRef.current.pause();
    }
  };

  const handleTrackEnded = () => {
    const nextIndex = (currentTrackIndex + 1) % RADIO_PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    // src for <audio> will update via currentTrackIndex, but we need to trigger play for next track
    if (audioDomRef.current && settings.sound) {
      // Small timeout to ensure src update is processed if needed (though React handles state)
      setTimeout(() => {
        audioDomRef.current.play().catch(() => {});
      }, 50);
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
          <div className="entrance-buttons">
            <button className="gate-btn main-gate" onClick={enterWorld} aria-label="Войти во Врата">Войти во Врата</button>
            {!user && (
              <div className="gate-auth-row">
                <button className="gate-secondary-btn" onClick={() => setIsAuthModalOpen(true)} aria-label="Войти или зарегистрироваться">Войти / Регистрация</button>
              </div>
            )}
          </div>
        </div>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onAuthSuccess={() => {}} 
        />
      </div>
    );
  }

  return (
    <>
      <audio 
        ref={audioDomRef} 
        src={RADIO_PLAYLIST[currentTrackIndex]} 
        onEnded={handleTrackEnded}
      />
      <FallingApples settings={settings} />
      <div className="app-container">
        <AppHeader 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          user={user}
          onLogout={handleLogout}
          onAuthClick={() => {
            playCrunch();
            setIsAuthModalOpen(true);
          }}
          settings={settings}
          setSettings={setSettings}
        />
        
        {/* Removed redundant header-spacer as app-container already has padding-top */}
        
        <div className="audio-controls">
          <button 
            onClick={toggleSound} 
            className={`sound-toggle-btn control-btn ${!settings.sound ? 'muted' : ''}`} 
            title={settings.sound ? "Выключить Радио Баяностана" : "Включить Радио Баяностана"}
            aria-label={settings.sound ? "Выключить звук" : "Включить звук"}
          >
            {settings.sound ? <Radio size={24} className="animate-pulse" /> : <VolumeX size={24} />}
          </button>
        </div>
        
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onAuthSuccess={() => {}} 
        />

        <main className="tab-content" id="main-content">
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

          {activeTab === 'donations' && (
            <div style={{animation: 'fade 0.5s'}}>
               <DonationSection />
            </div>
          )}

          {activeTab === 'chat' && (
            <div style={{animation: 'fade 0.5s'}}>
               <ChatModule user={user} />
            </div>
          )}

          {activeTab === 'profile' && user && (
            <div style={{animation: 'fade 0.5s'}}>
               <ProfileSection user={user} />
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default App
