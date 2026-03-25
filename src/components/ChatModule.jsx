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
    console.log("ChatModule: MOUNTED. User state:", !!user);
    if (!supabase) {
       console.error("ChatModule: Supabase client is missing!");
    }
    
    fetchMessages();
    
    // Subscribe to realtime updates
    console.log("ChatModule: Initializing subscription to public:messages...");
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        console.log("ChatModule: Realtime payload received:", payload);
        // Fetch the author's profile details to ensure UI has latest username/avatar
        let profileData = null;
        if (payload.new.user_id) {
          const { data } = await supabase
            .from('profiles')
            .select('username, avatar_url, status, is_admin')
            .eq('id', payload.new.user_id)
            .single();
          profileData = data;
        }
        
        const completeMessage = {
          ...payload.new,
          profiles: profileData || (payload.new.user_id ? { username: 'Безликий Прораб', avatar_url: null, status: 'offline' } : { username: 'ЮРИЙ БАЯНОВ', avatar_url: null, is_admin: true })
        };
        
        setMessages((current) => {
          // Prevent duplicates if fetch and subscription overlap
          if (current.find(m => m.id === completeMessage.id)) return current;
          return [...current, completeMessage];
        });
      })
      .subscribe((status) => {
         console.log("ChatModule: Realtime subscription status:", status);
      });

    return () => {
      console.log("ChatModule: UNMOUNTING.");
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
      console.log("ChatModule: Fetching messages...");
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            status,
            is_admin
          )
        `)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        console.error("ChatModule: Fetch error DETAILS:", error);
        throw error;
      }
      
      console.log("ChatModule: Messages successfully loaded, count:", data?.length);
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
      console.log("ChatModule: Sending message...", messageText);
      const { error } = await supabase
        .from('messages')
        .insert([{ content: messageText, user_id: user.id }]);

      if (error) {
        console.error("ChatModule: Send error:", error);
        throw error;
      }
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
                const isBayan = !msg.user_id;
                const profile = msg.profiles || (isBayan ? { username: 'ЮРИЙ БАЯНОВ', avatar_url: null, is_admin: true } : { username: 'Безликий' });
                
                return (
                  <div key={msg.id} className={`message-item ${isOwn ? 'own' : ''} ${isBayan ? 'system-bayan' : ''} ${profile.is_admin ? 'admin-msg' : ''}`}>
                    {!isOwn && (
                      <div className="sender-avatar">
                        {isBayan ? (
                          <div className="avatar-placeholder bayan-avatar">👑</div>
                        ) : profile.avatar_url ? (
                          <img src={optAvatar(profile.avatar_url, 80)} alt={profile.username} loading="lazy" />
                        ) : (
                          <div className="avatar-placeholder">🍎</div>
                        )}
                        {!isBayan && <div className={`status-dot ${profile.status === 'online' ? 'online' : ''}`} />}
                      </div>
                    )}
                    
                    <div className="message-bubble">
                      {!isOwn && (
                        <div className="sender-name-row">
                          <span className="sender-name">{profile.username}</span>
                          {isBayan && <span className="bayan-badge">АРХИ-ПРОРАБ</span>}
                          {profile.is_admin && !isBayan && <span className="admin-badge">АДМИН</span>}
                        </div>
                      )}
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
               ЗАШПАКЛЮЙСЯ В ВРАТАХ, ЧТОБЫ БАЗАРИТЬ С МУЖИКАМИ!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatModule;
