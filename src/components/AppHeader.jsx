import React, { useState } from 'react';
import { 
  Menu, X, ChevronDown, Monitor, Shield, Zap, Users, 
  HelpCircle, Sparkles, ScrollText, Timer, Target, Scissors, 
  Calculator, Image as ImageIcon, Heart, MessageSquare, User
} from 'lucide-react';
import ThematicTooltip from './ThematicTooltip';
import './AppHeader.css';

const AppHeader = ({ 
  activeTab, 
  setActiveTab, 
  user, 
  profile, 
  onLogout, 
  onAuthClick,
  settings,
  setSettings 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    {
      id: 'history',
      label: 'Святыни',
      icon: <Sparkles size={20} />,
      items: [
        { id: 'history', label: 'История', icon: <ScrollText size={18} /> },
        { id: 'chronicle', label: 'Летописи', icon: <Monitor size={18} /> },
        { id: 'book', label: 'Книга Лиц', icon: <Shield size={18} /> }
      ]
    },
    {
      id: 'tools',
      label: 'Инструменты',
      icon: <Zap size={20} />,
      items: [
        { id: 'timer', label: 'Таймер', icon: <Timer size={18} /> },
        { id: 'throw', label: 'Бросок', icon: <Target size={18} /> },
        { id: 'ai', label: 'Генератор', icon: <Scissors size={18} /> },
        { id: 'calc', label: 'Калькулятор', icon: <Calculator size={18} /> }
      ]
    },
    {
      id: 'rituals',
      label: 'Ритуалы',
      icon: <Target size={20} />,
      items: [
        { id: 'gallery', label: 'Галерея', icon: <ImageIcon size={18} /> },
        { id: 'donations', label: 'Подношения', icon: <Heart size={18} /> },
        { id: 'wiki', label: 'Вики', icon: <HelpCircle size={18} /> }
      ]
    },
    {
      id: 'community',
      label: 'Община',
      icon: <Users size={20} />,
      items: [
        { id: 'chat', label: 'Чат', icon: <MessageSquare size={18} /> },
        { id: 'profile', label: 'Профиль', icon: <User size={18} /> }
      ]
    }
  ];

  return (
    <header className="app-header">
      <div className="header-logo" onClick={() => setActiveTab('history')}>
        <span className="logo-sparkle">🍎</span>
        <h1 className="biblical-header logo-text">Баяностан</h1>
      </div>

      <button 
        className="mobile-menu-toggle" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div className={`header-main-content ${isMenuOpen ? 'mobile-open' : ''}`}>
        <nav className="header-nav">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="nav-category"
            >
              <ThematicTooltip text={cat.id === 'tools' ? "Для решения мирских проблем" : cat.label}>
                <div className={`category-label ${cat.items.some(i => i.id === activeTab) ? 'active' : ''}`}>
                  {cat.icon}
                  <span>{cat.label}</span>
                  <ChevronDown size={14} className="chevron" />
                </div>
              </ThematicTooltip>
              
              <div className="category-dropdown">
                {cat.items.map((item) => (
                  <button
                    key={item.id}
                    className={`dropdown-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="header-settings">
          <ThematicTooltip text={settings.noise ? "Утихомирить Сумщину" : "Услышать зов"}>
            <button 
              className={`settings-btn ${settings.noise ? 'active' : ''}`}
              onClick={() => setSettings('noise', !settings.noise)}
            >
              <Zap size={18} />
            </button>
          </ThematicTooltip>
          
          <ThematicTooltip text={settings.reducedMotion ? "Склеить время" : "Дать волю хаосу"}>
            <button 
              className={`settings-btn ${settings.reducedMotion ? 'active' : ''}`}
              onClick={() => setSettings('reducedMotion', !settings.reducedMotion)}
            >
              <Monitor size={18} />
            </button>
          </ThematicTooltip>
        </div>

        <div className="header-user-actions">
          {user ? (
            <div className="user-profile-menu">
              <div className="user-info" onClick={() => setActiveTab('profile')}>
                <div className="avatar-container">
                  <div className="user-avatar-small">
                    {profile?.avatar_url ? (
                      <img src={`https://images.weserv.nl/?url=${encodeURIComponent(profile.avatar_url)}&w=64&h=64&fit=cover&mask=circle`} alt="Avatar" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className={`online-indicator ${profile?.status === 'online' ? 'apple-green' : 'apple-red'}`}>
                  </div>
                </div>
                <span className="user-name-header">{profile?.username || user.email.split('@')[0]}</span>
              </div>
              <button 
                className="logout-btn" 
                onClick={onLogout}
                title="Покинуть обитель"
              >
                Выйти
              </button>
            </div>
          ) : (
            <button className="header-auth-btn" onClick={onAuthClick}>
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
