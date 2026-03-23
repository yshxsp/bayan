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
import DonationSection from './components/DonationSection'
import AuthModal from './components/AuthModal'
import AppHeader from './components/AppHeader'
import ChatModule from './components/ChatModule'
import ProfileSection from './components/ProfileSection'
import { supabase } from './supabaseClient'
import './components/EntranceStyles.css'

// import audio1 from './assets/audio/audio1.mp3'
const audio1 = '/assets/audio/audio1.mp3';

function App() {
  const [entered, setEntered] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
        // Set online status
        await supabase.from('profiles').update({ status: 'online' }).eq('id', currentUser.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (user) {
      await supabase.from('profiles').update({ status: 'offline' }).eq('id', user.id);
    }
    await supabase.auth.signOut();
  };

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
          <div className="entrance-buttons">
            <button className="gate-btn main-gate" onClick={enterWorld}>Войти во Врата</button>
            {!user && (
              <div className="gate-auth-row">
                <button className="gate-secondary-btn" onClick={() => setIsAuthModalOpen(true)}>Войти / Регистрация</button>
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
      <audio ref={audioDomRef} src={audio1} loop />
      <FallingApples />
      <div className="app-container" style={{ position: 'relative', zIndex: 10, paddingTop: '80px' }}>
        <AppHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user}
          onLogout={handleLogout}
          onAuthClick={() => setIsAuthModalOpen(true)}
        />
        
        <button onClick={toggleSound} className="sound-toggle-btn" title={isPlaying ? "Выключить святые песнопения" : "Включить святые песнопения"}>
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
        
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onAuthSuccess={() => {}} 
        />

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
