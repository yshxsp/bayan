import React, { useState } from 'react';
import { ChevronDown, User, LogOut, MessageSquare, Shield, Wrench, Zap, Users, EyeOff, Wind, Menu, X } from 'lucide-react';
import ThematicTooltip from './ThematicTooltip';
import './AppHeader.css';

const optAvatar = (url, size = 64) => {
  if (!url) return null;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${size}&h=${size}&fit=cover`;
};

const AppHeader = ({ activeTab, setActiveTab, user, profile, onLogout, onAuthClick, settings, setSettings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    {
      id: 'holy',
      label: 'Святыни',
      icon: <Shield size={18} />,
      items: [
        { id: 'history', label: 'Летописи Творения' },
        { id: 'book', label: 'Правила Баяна' },
        { id: 'wiki', label: 'Ложь и Истина' },
      ]
    },
    {
      id: 'tools',
      label: 'Инструменты',
      icon: <Wrench size={18} />,
      items: [
        { id: 'ai', label: 'Яблочный Интеллект' },
        { id: 'calc', label: 'Сборы налогов' },
        { id: 'timer', label: 'Часы Забвения' },
      ]
    },
    {
      id: 'rituals',
      label: 'Ритуалы',
      icon: <Zap size={18} />,
      items: [
        { id: 'throw', label: 'Обряд Бросания' },
        { id: 'gallery', label: 'Святилище Артов' },
      ]
    },
    {
      id: 'community',
      label: 'Община',
      icon: <Users size={18} />,
      items: [
        { id: 'chat', label: 'Чат Адептов' },
        { id: 'donations', label: 'Подношения Баяну' },
      ]
    }
  ];

  return (
    <header className="app-header glass-panel">
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
              
              <div className="category-dropdown glass-panel">
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
          <button 
            className={`settings-btn ${settings?.readingMode ? 'active' : ''}`}
            onClick={() => setSettings('readingMode', !settings.readingMode)}
            title="Режим чтения (приглушить яблоки)"
          >
            <EyeOff size={18} />
          </button>
          <button 
            className={`settings-btn ${settings?.reducedMotion ? 'active' : ''}`}
            onClick={() => setSettings('reducedMotion', !settings.reducedMotion)}
            title="Уменьшение движения"
          >
            <Wind size={18} />
          </button>
        </div>

        <div className="header-user-actions">
          {user ? (
            <div className="user-profile-menu">
              <div className="user-info" onClick={() => { setActiveTab('profile'); setIsMenuOpen(false); }}>
                <div className="avatar-container">
                  <div className="user-avatar-small">
                    {profile?.avatar_url ? (
                      <img src={optAvatar(profile.avatar_url, 64)} alt="Мой аватар" loading="lazy" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  {settings.presence && (
                    <span className={`online-indicator ${profile?.status === 'offline' ? 'apple-red' : 'apple-green'}`}></span>
                  )}
                </div>
                <span className="user-name-header">{profile?.username || user.email.split('@')[0]}</span>
              </div>
              <button className="logout-btn" onClick={() => { onLogout(); setIsMenuOpen(false); }} title="Выйти из гаража">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button className="header-auth-btn" onClick={() => { onAuthClick(); setIsMenuOpen(false); }}>
              Войти в Обитель
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
