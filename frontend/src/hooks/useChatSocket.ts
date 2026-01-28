import { useState, useEffect, useRef, useCallback } from 'react';
import type { IMessage, IError } from '@shared/types';

const SOCKET_URL = 'ws://localhost:8081';

interface UseChatSocketReturn {
  messages: IMessage[];
  isConnected: boolean;
  error: IError | null;
  sendMessage: (user: string, content: string) => void;
  clearError: () => void;
}

export function useChatSocket(): UseChatSocketReturn {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<IError | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(function connectToSocket() {
    const socket = new WebSocket(SOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'history') {
          setMessages(data.messages);
        } else if (data.type === 'message') {
          setMessages((prev) => [...prev, data.message]);
        } else if (data.type === 'error') {
          setError(data.error);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        connectToSocket();
      }, 3000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((user: string, content: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        user,
        content,
        timestamp: Date.now(),
      };
      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isConnected,
    error,
    sendMessage,
    clearError,
  };
}
