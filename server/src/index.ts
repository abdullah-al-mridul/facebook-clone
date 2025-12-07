import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import statusMonitor from "express-status-monitor";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import verificationRoutes from "./routes/verificationRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import groupRoutes from "./routes/groupRoutes";
import productRoutes from "./routes/productRoutes";
import savedRoutes from "./routes/savedRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import videoRoutes from "./routes/videoRoutes";

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(statusMonitor());

// Swagger
const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/marketplace", productRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/watch", videoRoutes);

app.get("/", (req, res) => {
  res.send("Facebook Clone API is running");
});

// Socket.io
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("send_message", (data) => {
    // data: { senderId, receiverId, content }
    io.to(data.receiverId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
