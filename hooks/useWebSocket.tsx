"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  useCallback,
  useMemo,
} from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  emitCartUpdate: () => void;
  requestNotifications: () => void;
  subscribeToNotifications: (
    callback: (notification: any) => void,
  ) => () => void;
  subscribeToCartUpdates: (callback: (cart: any) => void) => () => void;
  subscribeToTrainerApplications: (
    callback: (application: any) => void,
  ) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Store callbacks to avoid recreating them
  const notificationCallbacks = useRef<Set<(notification: any) => void>>(
    new Set(),
  );
  const cartCallbacks = useRef<Set<(cart: any) => void>>(new Set());
  const trainerCallbacks = useRef<Set<(application: any) => void>>(new Set());

  useEffect(() => {
    // Only connect if we have a session
    if (!session?.user) {
      // Disconnect if no session
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Don't create multiple connections
    if (socketRef.current?.connected) {
      return;
    }

    // Clean up any existing disconnected socket
    if (socketRef.current && !socketRef.current.connected) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Initialize socket connection to standalone WebSocket server
    const socket = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 3000,
      reconnectionAttempts: 3,
      timeout: 10000,
      forceNew: true, // Force a new connection
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      setIsConnected(true);
      setConnectionError(null);

      // Join user-specific room
      if (session.user?.id) {
        socket.emit("join-user-room", session.user.id);
      }

      // Join admin room if user is admin
      if (session.user?.role === "ADMIN") {
        socket.emit("join-admin-room");
      }
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      setConnectionError(error.message);
      setIsConnected(false);
    });

    socket.on("reconnect_failed", () => {
      setConnectionError("Connection failed");
    });

    // Event listeners that call all subscribed callbacks
    socket.on("new-notification", (notification) => {
      notificationCallbacks.current.forEach((callback) =>
        callback(notification),
      );
    });

    socket.on("cart-updated", (cart) => {
      cartCallbacks.current.forEach((callback) => callback(cart));
    });

    socket.on("new-trainer-application", (application) => {
      trainerCallbacks.current.forEach((callback) => callback(application));
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      // Clear all callbacks
      notificationCallbacks.current.clear();
      cartCallbacks.current.clear();
      trainerCallbacks.current.clear();
    };
  }, [session?.user?.id, session?.user?.role]); // Only depend on user ID and role

  // Helper functions to emit events
  const emitCartUpdate = useCallback(() => {
    if (socketRef.current && session?.user?.id) {
      socketRef.current.emit("update-cart", session.user.id);
    }
  }, [session?.user?.id]);

  const requestNotifications = useCallback(() => {
    if (socketRef.current && session?.user?.id) {
      socketRef.current.emit("get-notifications", session.user.id);
    }
  }, [session?.user?.id]);

  // Subscription methods for components to listen to events
  const subscribeToNotifications = useCallback(
    (callback: (notification: any) => void) => {
      notificationCallbacks.current.add(callback);
      return () => {
        notificationCallbacks.current.delete(callback);
      };
    },
    [],
  );

  const subscribeToCartUpdates = useCallback(
    (callback: (cart: any) => void) => {
      cartCallbacks.current.add(callback);
      return () => {
        cartCallbacks.current.delete(callback);
      };
    },
    [],
  );

  const subscribeToTrainerApplications = useCallback(
    (callback: (application: any) => void) => {
      trainerCallbacks.current.add(callback);
      return () => {
        trainerCallbacks.current.delete(callback);
      };
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      socket: socketRef.current,
      isConnected,
      connectionError,
      emitCartUpdate,
      requestNotifications,
      subscribeToNotifications,
      subscribeToCartUpdates,
      subscribeToTrainerApplications,
    }),
    [
      isConnected,
      connectionError,
      emitCartUpdate,
      requestNotifications,
      subscribeToNotifications,
      subscribeToCartUpdates,
      subscribeToTrainerApplications,
    ],
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}

// Hook for components to use the WebSocket context
export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
