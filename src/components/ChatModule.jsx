import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Send, Hash, MessageSquare, Apple, Zap } from 'lucide-react';
import './ChatModule.css';

const ChatModule = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [profiles, setProfiles] = useState({});
  const scrollRef = useRef();

  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        handleNewMessage(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleNewMessage = async (msg) => {
    if (!profiles[msg.user_id]) {
      await fetchProfile(msg.user_id);
    }
    setMessages(prev => [...prev, msg]);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);
    
    if (data) {
      // Collect unique user ids to fetch profiles
      const userIds = [...new Set(data.map(m => m.user_id))];
      await fetchProfiles(userIds);
      setMessages(data);
    }
  };

  const fetchProfiles = async (ids) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, status')
      .in('id', ids);
    
    if (data) {
      const pMap = {};
      data.forEach(p => pMap[p.id] = p);
      setProfiles(prev => ({...prev, ...pMap}));
    }
  };

  const fetchProfile = async (id) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, status')
      .eq('id', id)
      .single();
    if (data) {
      setProfiles(prev => ({...prev, [id]: data}));
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert([{ 
        content: newMessage, 
        user_id: user.id 
      }]);

    if (!error) setNewMessage('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!user) {
    return (
      <div className="chat-locked glass-panel">
        <Zap size={48} className="lock-icon" />
        <h2 className="biblical-header">Врата Закрыты</h2>
        <p>Только истинные Адепты могут вещать в общем канале. Войдите во Врата, чтобы примкнуть к нам.</p>
      </div>
    );
  }

  return (
    <section className="chat-container glass-panel">
      <div className="chat-header">
        <Hash size={20} />
        <span>общий-канал-баян</span>
        <div className="online-count">
          <Apple size={14} /> 
          <span>{Object.keys(profiles).length} Адептов</span>
        </div>
      </div>

      <div className="chat-messages" ref={scrollRef}>
        {messages.map((msg) => {
          const profile = profiles[msg.user_id] || { username: 'Странник', avatar_url: null };
          const isOwn = msg.user_id === user.id;

          return (
            <div key={msg.id} className={`chat-message ${isOwn ? 'own' : ''}`}>
              {!isOwn && (
                <div className="message-avatar">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={`Аватар ${profile.username}`} loading="lazy" />
                  ) : (
                    <div className="avatar-placeholder">🍎</div>
                  )}
                </div>
              )}
              <div className="message-content">
                {!isOwn && <span className="message-author">{profile.username}</span>}
                <div className="message-bubble">{msg.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      <form className="chat-input-area" onSubmit={sendMessage}>
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Вещай истину..." 
        />
        <button type="submit" className="send-btn" aria-label="Отправить сообщение">
          <Send size={18} />
        </button>
      </form>
    </section>
  );
};

export default ChatModule;
