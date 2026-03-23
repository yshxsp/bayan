import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { X, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { username: username }
          }
        });
        if (error) throw error;

        // Create profile in public.profiles if signup successful
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({ 
              id: data.user.id, 
              username: username || email.split('@')[0],
              status: 'online'
            });
          if (profileError) console.error('Error creating profile:', profileError);
        }
      }
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal glass-panel">
        <button className="close-modal-btn" onClick={onClose}><X size={20} /></button>
        <h2 className="biblical-header auth-title">{isLogin ? 'Вход в Обитель' : 'Обряд Регистрации'}</h2>
        
        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label>Имя (Ник)</label>
              <input 
                type="text" 
                placeholder="Миксер2000" 
                value={username}
                onChange={(e) => setUsername(e.target.value.slice(0, 20))}
                required 
              />
            </div>
          )}
          <div className="input-group">
            <label>Почта</label>
            <input 
              type="email" 
              placeholder="bayan@sumy.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Пароль</label>
            <input 
              type="password" 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Духи думают...' : (isLogin ? <><LogIn size={18} /> Войти</> : <><UserPlus size={18} /> Стать адептом</>)}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? 'Еще не с нами?' : 'Уже в теме?'} 
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Пройти обряд регистрации' : ' Войти в гараж'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
