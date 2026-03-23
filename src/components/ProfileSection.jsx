import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Camera, Save, User, Shield, Zap, Sparkles } from 'lucide-react';
import './ProfileSection.css';

const ProfileSection = ({ user }) => {
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    avatar_url: '',
    status: 'online',
    holy_rank: 'Адепт'
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    getProfile();
  }, [user]);

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`username, full_name, avatar_url, status`)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error loading profile:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setUpdating(true);
      const updates = {
        id: user.id,
        ...profile,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      alert('Лик обновлен в Великой Книге!');
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  }

  const handleAvatarUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      
      // Sync with user metadata immediately for header
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

    } catch (error) {
      alert('Ошибка при вознесении лика: ' + error.message);
    }
  };

  if (loading) return <div className="loading-bible">Читаем свитки судьбы...</div>;

  return (
    <section className="profile-container glass-panel">
      <div className="profile-header-banner">
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <div className="large-avatar">
              {avatarUrl ? <img src={avatarUrl} alt="Аватар Адепта" loading="lazy" /> : <User size={60} />}
              <label className="avatar-upload-overlay" title="Сменить лик">
                <Camera size={24} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarUpload} 
                  hidden 
                />
              </label>
            </div>
            <div className="rank-badge">
              <Shield size={14} />
              <span>{profile.holy_rank || 'Адепт'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-info-grid">
        <div className="info-card glass-panel">
          <label>Имя в Летописях</label>
          <input 
            type="text" 
            value={profile.username || ''} 
            onChange={(e) => setProfile({...profile, username: e.target.value})}
            placeholder="Как зовут тебя, путник?"
          />
        </div>
        <div className="info-card glass-panel">
          <label>Статус Души</label>
          <div className="status-selector">
            <span className={`status-dot ${profile.status}`}></span>
            <select 
              value={profile.status} 
              onChange={(e) => setProfile({...profile, status: e.target.value})}
            >
              <option value="online">В Глянце (Online)</option>
              <option value="offline">В Гараже (Offline)</option>
              <option value="away">На Стройке (Away)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h3 className="biblical-header"><Sparkles size={20} /> Заслуги перед Баяном</h3>
        <div className="achievements-list">
          <div className="achievement-item locked">
            <Zap size={24} />
            <div className="ach-tooltip">Первая Покрышка: Соберите 100 яблок</div>
          </div>
        </div>
      </div>

      <button 
        className="save-profile-btn" 
        onClick={updateProfile}
        disabled={updating}
      >
        <Save size={20} />
        {updating ? 'Запечатываем...' : 'Сохранить Истину'}
      </button>
    </section>
  );
};

export default ProfileSection;
