import React, { useState } from 'react';
import { Send, User } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  username: string;
  onUsernameChange: (name: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, username, onUsernameChange }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="input-area">
      <div className="user-settings">
        <User size={18} className="text-secondary" />
        <input
          type="text"
          placeholder="Your name..."
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="username-input"
        />
      </div>
      <form onSubmit={handleSubmit} className="input-group">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
        />
        <button type="submit" disabled={!message.trim() || !username.trim()}>
          <Send size={18} />
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
