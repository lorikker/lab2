import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { db } from '@/db';

export class WebSocketManager {
  private io: SocketIOServer | null = null;
  private static instance: WebSocketManager;

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXTAUTH_URL 
          : "http://localhost:3001",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join user-specific room
      socket.on('join-user-room', (userId: string) => {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      // Join admin room
      socket.on('join-admin-room', () => {
        socket.join('admin-room');
        console.log('Admin joined admin room');
      });

      // Handle cart updates
      socket.on('update-cart', async (userId: string) => {
        try {
          const cart = await this.fetchUserCart(userId);
          socket.emit('cart-updated', cart);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  // Emit notification to specific user
  emitToUser(userId: string, event: string, data: any) {
    if (this.io) {
      this.io.to(`user-${userId}`).emit(event, data);
    }
  }

  // Emit to all admins
  emitToAdmins(event: string, data: any) {
    if (this.io) {
      this.io.to('admin-room').emit(event, data);
    }
  }

  // Emit to all connected clients
  emitToAll(event: string, data: any) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  private async fetchUserCart(userId: string) {
    return await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            bundle: true
          }
        }
      }
    });
  }
}

export const wsManager = WebSocketManager.getInstance();
