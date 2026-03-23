import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User, Camera, Save, CheckCircle } from 'lucide-react';
import './ProfileSection.css';

const ProfileSection = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState(null);

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
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      
      // Update auth metadata too
      await supabase.auth.updateUser({
        data: { username, avatar_url: avatarUrl }
      });

      setMessage({ type: 'success', text: 'Профиль успешно покрыт глянцем!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-container glass-panel">
      <h2 className="biblical-header profile-title">Личные Покои Адепта</h2>
      
      <div className="profile-card">
        <div className="avatar-section">
          <div className="large-avatar">
            {avatarUrl ? <img src={avatarUrl} alt="profile" /> : <User size={60} />}
            <label className="avatar-upload-overlay" title="Сфотать лицо">
              <Camera size={24} />
              <input 
                type="text" 
                placeholder="URL иконки" 
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </label>
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
              <span className="stat-label">Статус</span>
              <span className="stat-value"><span className="online-indicator apple-green"></span> В сети</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Почта</span>
              <span className="stat-value">{user.email}</span>
            </div>
          </div>

          <button type="submit" className="save-profile-btn" disabled={loading}>
            {loading ? 'Шпаклюю...' : <><Save size={20} /> Зашпаклевать изменения</>}
          </button>

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
