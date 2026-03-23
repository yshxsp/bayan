import React, { useState } from 'react';
import { ChevronDown, User, LogOut, MessageSquare, Shield, Wrench, Zap, Users } from 'lucide-react';
import './AppHeader.css';

const AppHeader = ({ activeTab, setActiveTab, user, onLogout, onAuthClick }) => {
  const [activeCategory, setActiveCategory] = useState(null);

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

      <nav className="header-nav">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="nav-category"
            onMouseEnter={() => setActiveCategory(cat.id)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className={`category-label ${cat.items.some(i => i.id === activeTab) ? 'active' : ''}`}>
              {cat.icon}
              <span>{cat.label}</span>
              <ChevronDown size={14} className="chevron" />
            </div>
            
            <div className="category-dropdown glass-panel">
              {cat.items.map((item) => (
                <button
                  key={item.id}
                  className={`dropdown-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="header-user-actions">
        {user ? (
          <div className="user-profile-menu">
            <div className="user-info" onClick={() => setActiveTab('profile')}>
              <div className="user-avatar-small">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Мой аватар" loading="lazy" />
                ) : (
                  <User size={20} />
                )}
                <span className="online-indicator apple-green"></span>
              </div>
              <span className="user-name-header">{user.user_metadata?.username || user.email.split('@')[0]}</span>
            </div>
            <button className="logout-btn" onClick={onLogout} title="Выйти из гаража">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button className="header-auth-btn" onClick={onAuthClick}>
            Войти в Обитель
          </button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
