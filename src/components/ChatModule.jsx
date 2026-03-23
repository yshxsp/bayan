import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Send, UserPlus, MessageCircle, MoreVertical, Loader2 } from 'lucide-react';
import './ChatModule.css';

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
  } else if (now.getFullYear() === date.getFullYear()) {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  } else {
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.');
  }
};

const ChatModule = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initChat();

    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        // Only add if it's not already there (prevents double messages from inserts + subscriptions)
        setMessages((prev) => {
           if (prev.find(m => m.id === payload.new.id)) return prev;
           return [...prev, payload.new];
        });
        
        // Ensure profile is fetched if it's a new sender
        if (!profiles[payload.new.sender_id]) {
          fetchProfiles();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initChat = async () => {
    setLoading(true);
    await Promise.all([fetchMessages(), fetchProfiles()]);
    setLoading(false);
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);
      
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Не удалось загрузить священный чат...');
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, status');
      
      if (error) throw error;
      const profileMap = {};
      data?.forEach(p => profileMap[p.id] = p);
      setProfiles(profileMap);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageContent = newMessage;
    setNewMessage(''); // optimistic clear

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ 
          content: messageContent, 
          sender_id: user.id 
        }]);

      if (error) throw error;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Баян не принял твое послание. Попробуй еще раз, червивый прораб!');
      setNewMessage(messageContent); // Restore on error
    }
  };

  return (
    <div className="chat-container glass-panel">
      <div className="chat-messages">
        {loading ? (
          <div className="chat-loading">
            <Loader2 className="animate-spin" size={32} />
            <p>Опрашиваем адептов...</p>
          </div>
        ) : error ? (
          <div className="chat-error">
            <p>{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <MessageCircle size={40} opacity={0.3} />
            <p>Здесь пока тишина. Будь первым, кто прославит Баяна!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const profile = profiles[msg.sender_id] || { username: 'Аноним' };
            const isOwn = user?.id === msg.sender_id;

            return (
              <div key={msg.id} className={`message-wrapper ${isOwn ? 'own' : ''}`}>
                {!isOwn && (
                  <div className="message-avatar">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={`Аватар \${profile.username}`} loading="lazy" />
                    ) : (
                      <div className="avatar-placeholder">🍎</div>
                    )}
                    <div className={`status-dot \${profile.status === 'online' ? 'green' : 'red'}`}></div>
                  </div>
                )}
                <div className="message-content-box">
                  <div className="message-header">
                    <span className="sender-name">{profile.username}</span>
                    <span className="message-time">{formatSmartDate(msg.created_at)}</span>
                  </div>
                  <p className="message-text">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={sendMessage}>
        <input 
          type="text" 
          placeholder={user ? "Напишите что-нибудь..." : "Войдите, чтобы писать в чат"}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!user || loading}
        />
        <button type="submit" disabled={!user || !newMessage.trim() || loading}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatModule;
