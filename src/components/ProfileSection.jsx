import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { User, Camera, Save, Loader2, Calendar, MapPin, Link as LinkIcon, AlertCircle } from 'lucide-react';
import './ProfileSection.css';

const optAvatar = (url, size = 150) => {
  if (!url) return null;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${size}&h=${size}&fit=cover`;
};

const ProfileSection = ({ user, profile, onProfileUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // States for form
  const [username, setUsername] = useState(profile?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [personalLink, setPersonalLink] = useState(profile?.personal_link || '');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updates = {
        id: user.id,
        username,
        avatar_url: avatarUrl,
        bio,
        location,
        personal_link: personalLink,
        updated_at: new Date(),
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert(updates);

      if (updateError) throw updateError;
      
      // Critical: Wait for parents to sync before closing edit mode
      await onProfileUpdate(); 
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="profile-locked glass-panel text-center">
      <h2 className="biblical-header">Зал Славы Прорабов</h2>
      <p>Твой личный гараж закрыт на замок. Войди через Врата, чтобы увидеть свой инвентарь!</p>
    </div>
  );

  return (
    <div className="profile-container glass-panel">
      <div className="profile-hero">
        <div className="avatar-wrapper">
          <div className="large-avatar">
            {profile?.avatar_url ? (
              <img src={optAvatar(profile.avatar_url, 150)} alt="User" />
            ) : (
              <User size={60} />
            )}
            {editing && (
              <div className="avatar-overlay">
                <Camera size={24} />
              </div>
            )}
          </div>
          <span className={`large-status-dot ${profile?.status === 'online' ? 'online' : ''}`}>
            {profile?.status === 'online' ? '🍏' : '🍎'}
          </span>
        </div>
        
        <div className="profile-main-info">
          <h1 className="profile-title">{profile?.username || 'Безымянный Адепт'}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-badges">
            <span className="badge-senior">Старший Разнорабочий</span>
            <span className="badge-apple">Хранитель Яблок</span>
          </div>
        </div>
        
        <button 
          className="btn-gothic edit-profile-toggle"
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Отмена Обряда' : 'Изменить Лик'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleUpdate} className="profile-edit-form">
          {error && <div className="error-msg"><AlertCircle size={16}/> {error}</div>}
          
          <div className="edit-grid">
            <div className="input-field">
              <label>Священное Имя</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Твой ник в Баяностане"
              />
            </div>
            <div className="input-field">
              <label>Ссылка на Лик (Avatar URL)</label>
              <input 
                type="text" 
                value={avatarUrl} 
                onChange={(e) => setAvatarUrl(e.target.value)} 
                placeholder="https://imgur.com/..."
              />
            </div>
          </div>

          <div className="input-field">
            <label>Твое Слово (Bio)</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Расскажи, как ты любишь Яблочный Раствор..."
            />
          </div>

          <div className="edit-grid">
            <div className="input-field">
              <label><MapPin size={14}/> Координаты Гаража</label>
              <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Сумы, Цех №5"
              />
            </div>
            <div className="input-field">
              <label><LinkIcon size={14}/> Профсоюзная Ссылка</label>
              <input 
                type="text" 
                value={personalLink} 
                onChange={(e) => setPersonalLink(e.target.value)} 
                placeholder="https://mysite.com"
              />
            </div>
          </div>

          <button type="submit" className="save-profile-btn" disabled={loading}>
            {loading ? <Loader2 className="animate-spin"/> : <Save size={18}/>}
            Запечатать Изменения
          </button>
        </form>
      ) : (
        <div className="profile-details">
          <div className="bio-section">
            <h3>О Себе</h3>
            <p>{profile?.bio || 'Этот адепт пока молчит, как яблоко в вазе...'}</p>
          </div>
          
          <div className="profile-stats">
            <div className="stat-card">
              <span className="stat-val">128</span>
              <span className="stat-label">Вкладов в Общину</span>
            </div>
            <div className="stat-card">
              <span className="stat-val">42</span>
              <span className="stat-label">Покрышки на Волгу</span>
            </div>
            <div className="stat-card">
              <Calendar size={20} className="icon-calendar"/>
              <span className="stat-label">С нами с 2024</span>
            </div>
          </div>
          
          <div className="profile-actions-grid">
             <button className="profile-action-btn">Инвентарь</button>
             <button className="profile-action-btn">Достижения</button>
             <button className="profile-action-btn">Связи</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
