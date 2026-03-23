import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Send, User, Loader2, MessageCircle } from 'lucide-react';
import './ChatModule.css';

const optAvatar = (url, size = 100) => {
  if (!url) return null;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${size}&h=${size}&fit=cover`;
};

const formatSmartDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const oneDay = 24 * 60 * 60 * 1000;

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (diff < oneDay && now.getDate() === date.getDate()) {
    return timeStr;
  } else if (diff < 2 * oneDay && now.getDate() - date.getDate() === 1) {
    return `Вчера, ${timeStr}`;
  } else if (diff < 7 * oneDay) {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return `${days[date.getDay()]}, ${timeStr}`;
  } else {
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  }
};

const ChatModule = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        // Fetch the author's profile details to ensure UI has latest username/avatar
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, avatar_url, status')
          .eq('id', payload.new.user_id)
          .single();
        
        const completeMessage = {
          ...payload.new,
          profiles: profileData || { username: 'Безликий Прораб', avatar_url: null, status: 'offline' }
        };
        
        setMessages((current) => {
          // Prevent duplicates if fetch and subscription overlap
          if (current.find(m => m.id === completeMessage.id)) return current;
          return [...current, completeMessage];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            status
          )
        `)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Ошибка в архивах гаража:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input optimistically

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ content: messageText, user_id: user.id }]);

      if (error) throw error;
    } catch (error) {
      console.error('Баян отклонил указку:', error);
      setNewMessage(messageText); // Restore on failure
    }
  };

  return (
    <div className="bayan-chat-wrapper">
      <div className="chat-container glass-panel">
        <div className="chat-header">
           <h2 className="biblical-header">Гаражный Треп</h2>
        </div>
        
        <div className="chat-messages">
          {loading ? (
            <div className="chat-status-display">
              <Loader2 className="animate-spin" size={32} />
              <p>Раздуваем меха летописей...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="chat-status-display">
              <MessageCircle size={48} opacity={0.2} />
              <p>В гараже звенящая пустота. Кричи первым!</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => {
                const isOwn = user && msg.user_id === user.id;
                const profile = msg.profiles || { username: 'Безликий' };
                
                return (
                  <div key={msg.id} className={`message-item ${isOwn ? 'own' : ''}`}>
                    {!isOwn && (
                      <div className="sender-avatar">
                        {profile.avatar_url ? (
                          <img src={optAvatar(profile.avatar_url, 80)} alt={profile.username} loading="lazy" />
                        ) : (
                          <div className="avatar-placeholder">🍎</div>
                        )}
                        <div className={`status-dot ${profile.status === 'online' ? 'online' : ''}`} />
                      </div>
                    )}
                    
                    <div className="message-bubble">
                      {!isOwn && <div className="sender-name">{profile.username}</div>}
                      <div className="message-content">{msg.content}</div>
                      <div className="message-time">{formatSmartDate(msg.created_at)}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} className="chat-input-row">
          {user ? (
            <>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Что скажешь адептам?"
                className="chat-input"
                maxLength={500}
                required
              />
              <button 
                type="submit" 
                className="chat-submit-btn" 
                disabled={!newMessage.trim()}
              >
                <Send size={20} />
              </button>
            </>
          ) : (
            <div className="chat-locked-prompt">
               Зашпаклюйся в Вратах, чтобы базарить с мужиками!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatModule;
