import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Send, UserPlus, MessageCircle, MoreVertical } from 'lucide-react';
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
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchProfiles();

    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);
    
    if (error) console.error('Error fetching messages:', error);
    else setMessages(data);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, status');
    
    if (error) console.error('Error fetching profiles:', error);
    else {
      const profileMap = {};
      data.forEach(p => profileMap[p.id] = p);
      setProfiles(profileMap);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const { error } = await supabase
      .from('messages')
      .insert([{ 
        content: newMessage, 
        sender_id: user.id 
      }]);

    if (error) console.error('Error sending message:', error);
    else setNewMessage('');
  };

  return (
    <div className="chat-container glass-panel">
      <div className="chat-messages">
        {messages.map((msg) => {
          const profile = profiles[msg.sender_id] || { username: 'Аноним' };
          const isOwn = user?.id === msg.sender_id;

          return (
            <div key={msg.id} className={`message-wrapper ${isOwn ? 'own' : ''}`}>
              {!isOwn && (
                <div className="message-avatar">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" />
                  ) : (
                    <div className="avatar-placeholder">🍎</div>
                  )}
                  <div className={`status-dot ${profile.status === 'online' ? 'green' : 'red'}`}></div>
                </div>
              )}
              <div className="message-content-box">
                <div className="message-header">
                  <span className="sender-name">{profile.username}</span>
                  <span className="message-time">{formatSmartDate(msg.created_at)}</span>
                </div>
                <p className="message-text">{msg.content}</p>
                {!isOwn && (
                  <div className="message-actions">
                    <button title="Добавить в друзья"><UserPlus size={14} /></button>
                    <button title="Написать в ЛС"><MessageCircle size={14} /></button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={sendMessage}>
        <input 
          type="text" 
          placeholder={user ? "Напишите что-нибудь..." : "Войдите, чтобы писать в чат"}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!user}
        />
        <button type="submit" disabled={!user || !newMessage.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatModule;
