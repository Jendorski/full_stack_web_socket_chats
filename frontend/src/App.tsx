import { useState, useEffect, useRef } from 'react';
import MessageItem from './components/MessageItem';
import ChatInput from './components/ChatInput';
import { MessageSquare, AlertCircle, X } from 'lucide-react';
import { useChatSocket } from './hooks/useChatSocket';

function App() {
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('chat_username') || 'Anonymous';
  });
  
  const { messages, isConnected, error, sendMessage, clearError } = useChatSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('chat_username', username);
  }, [username]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSendMessage = (content: string) => {
    sendMessage(username, content);
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header className="header">
          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare className="text-accent" style={{ color: 'var(--accent-color)' }} />
            <h1>Start Chat WebApp</h1>
          </div>
          <div className="connection-status" style={{ fontSize: '0.75rem', color: isConnected ? '#10b981' : '#f43f5e' }}>
            {isConnected ? '● Connected' : '○ Disconnected'}
          </div>
        </header>
        
        {error && (
          <div className="error-banner" style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#f43f5e',
            padding: '0.75rem',
            margin: '0.5rem 1rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{error.message}</span>
            </div>
            <button 
              onClick={clearError}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="messages-container" ref={scrollRef}>
          {messages.length === 0 ? (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              No messages yet. Say hello!
            </div>
          ) : (
            messages.map((msg) => (
              <MessageItem 
                key={msg.id} 
                message={msg} 
                isOwn={msg.user === username} 
              />
            ))
          )}
        </div>

        <ChatInput 
          onSendMessage={handleSendMessage} 
          username={username} 
          onUsernameChange={setUsername} 
        />
      </div>
    </div>
  );
}

export default App;
