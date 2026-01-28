import React from 'react';
import type { IMessage } from '@shared/types';

interface MessageItemProps {
  message: IMessage;
  isOwn: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwn }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-item ${isOwn ? 'own' : ''}`}>
      <div className="message-info">
        <span className="message-user">{message.user}</span>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
      <div className="message-bubble">
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default MessageItem;
