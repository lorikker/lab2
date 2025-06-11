import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3001;

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Create Socket.IO server
  const io = new Server(httpServer, {
    cors: {
      origin: dev ? "http://localhost:3001" : process.env.NEXTAUTH_URL,
      methods: ["GET", "POST"],
    },
  });

  // Socket.IO connection handling
  io.on("connection", (socket) => {
    // Join user-specific room
    socket.on("join-user-room", (userId) => {
      socket.join(`user-${userId}`);
    });

    // Join admin room
    socket.on("join-admin-room", () => {
      socket.join("admin-room");
    });

    // Handle cart updates
    socket.on("update-cart", async (userId) => {
      try {
        socket.emit("cart-updated", { userId, timestamp: new Date() });
      } catch (error) {
        console.error("Error handling cart update:", error);
      }
    });

    socket.on("disconnect", () => {
      // Silent disconnect
    });
  });

  // Make io available globally for API routes
  global.io = io;

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
