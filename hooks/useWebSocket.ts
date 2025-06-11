'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  onNotification?: (notification: any) => void;
  onCartUpdate?: (cart: any) => void;
  onTrainerApplication?: (application: any) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Only connect if we have a session
    if (!session?.user) return;

    // Initialize socket connection
    const socket = io(process.env.NODE_ENV === 'production' 
      ? process.env.NEXTAUTH_URL! 
      : 'http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      setConnectionError(null);

      // Join user-specific room
      if (session.user.id) {
        socket.emit('join-user-room', session.user.id);
      }

      // Join admin room if user is admin
      if (session.user.role === 'ADMIN') {
        socket.emit('join-admin-room');
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Event listeners
    socket.on('new-notification', (notification) => {
      console.log('New notification received:', notification);
      options.onNotification?.(notification);
    });

    socket.on('cart-updated', (cart) => {
      console.log('Cart updated:', cart);
      options.onCartUpdate?.(cart);
    });

    socket.on('new-trainer-application', (application) => {
      console.log('New trainer application:', application);
      options.onTrainerApplication?.(application);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session, options.onNotification, options.onCartUpdate, options.onTrainerApplication]);

  // Helper functions to emit events
  const emitCartUpdate = () => {
    if (socketRef.current && session?.user?.id) {
      socketRef.current.emit('update-cart', session.user.id);
    }
  };

  const requestNotifications = () => {
    if (socketRef.current && session?.user?.id) {
      socketRef.current.emit('get-notifications', session.user.id);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    emitCartUpdate,
    requestNotifications
  };
}
