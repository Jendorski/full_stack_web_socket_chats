import { useState, useEffect, useRef, useCallback } from 'react';
import type { IMessage, IError } from '@shared/types';

const SOCKET_URL = 'ws://localhost:8081';
const INITIAL_BACKOFF = 1000;
const MAX_BACKOFF = 30000;
const MAX_RETRIES = 10;

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
  const retryCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = useCallback(function connectToSocket() {
    // Clear any pending reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    const socket = new WebSocket(SOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      retryCountRef.current = 0; // Reset retry count on successful connection
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

      if (retryCountRef.current < MAX_RETRIES) {
        const delay = Math.min(INITIAL_BACKOFF * Math.pow(2, retryCountRef.current), MAX_BACKOFF);
        console.log(`Attempting to reconnect in ${delay}ms (Attempt ${retryCountRef.current + 1}/${MAX_RETRIES})`);
        
        reconnectTimeoutRef.current = window.setTimeout(() => {
          retryCountRef.current += 1;
          connectToSocket();
        }, delay);
      } else {
        console.error('Max reconnection retries reached. Please refresh the page to try again.');
        setError({
          code: 'CONNECTION_FAILED',
          message: 'Connection to server lost. Max retries reached.'
        });
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
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
