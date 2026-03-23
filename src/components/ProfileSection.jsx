import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User, Camera, Save, CheckCircle, Share2, Check, Copy } from 'lucide-react';
import './ProfileSection.css';

const optAvatar = (url, size = 300) => {
  if (!url) return null;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${size}&h=${size}&fit=cover`;
};

const ProfileSection = ({ user, onProfileUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyInviteLink = () => {
    const link = `${window.location.origin}/invite/${user?.id || 'bayan'}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    getProfile();
  }, [user]);

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error loading user data!', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(e) {
    e.preventDefault();

    try {
      setLoading(true);
      const updates = {
        id: user.id,
        username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      
      // Update auth metadata too
      await supabase.auth.updateUser({
        data: { username, avatar_url: avatarUrl }
      });

      setMessage({ type: 'success', text: 'Профиль успешно покрыт глянцем!' });
      if (onProfileUpdate) onProfileUpdate();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-container glass-panel">
      <h2 className="biblical-header profile-title">Личные Покои Адепта</h2>
      
      <div className="profile-card">
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <div className="large-avatar">
              {avatarUrl ? (
                <img src={optAvatar(avatarUrl, 300)} alt="Аватар Адепта" loading="lazy" />
              ) : (
                <div className="empty-avatar-placeholder">
                  <User size={40} />
                  <span>Нет Лика</span>
                </div>
              )}
            </div>
            
            <div className="avatar-input-wrapper">
              <input 
                type="text" 
                placeholder="Вставь URL картинки сюда" 
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="avatar-url-input-field"
              />
              <Camera className="input-icon" size={18} />
            </div>
            {/* The user is logically always online when viewing their own profile */}
            <div className="online-indicator-profile apple-green" title="В сети Баяностана"></div>
          </div>
          <p className="avatar-hint">Вставь прямую ссылку на картинку, червивый прораб!</p>
        </div>

        <form onSubmit={updateProfile} className="profile-form">
          <div className="profile-input-group">
            <label>Твое Имя в Баяностане</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 20))}
              placeholder="Как тебя кличут?"
              required
            />
            <small>{username.length}/20 символов</small>
          </div>

          <div className="profile-stats">
            <div className="stat-box">
              <span className="stat-label">Твой Дух</span>
              <span className="stat-value">Свеж как Яблоко</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Почта</span>
              <span className="stat-value">{user.email}</span>
            </div>
          </div>

          <div className="profile-actions-grid">
            <button type="submit" className="save-profile-btn" disabled={loading}>
              {loading ? 'Шпаклюю...' : <><Save size={20} /> Зашпаклевать профиль</>}
            </button>
            <button type="button" className="invite-btn" onClick={copyInviteLink}>
              {copied ? <Check size={20} /> : <Share2 size={20} />}
              {copied ? 'Ссылка скопирована!' : 'Позвать соседа в гараж'}
            </button>
          </div>

          {message && (
            <div className={`profile-message ${message.type}`}>
              <CheckCircle size={18} />
              <span>{message.text}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileSection;
