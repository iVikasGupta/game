import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import authRoutes from "./routes/auth.routes.js";
import decisionRoutes from "./routes/decision.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import groupRoutes from "./routes/group.routes.js";

// Set DNS servers to Google DNS to fix SRV lookup issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/decisions", decisionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/groups", groupRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

// MongoDB connection options for better reliability
const mongoOptions = {
  serverSelectionTimeoutMS: 30000, // Timeout after 30s instead of 10s
  socketTimeoutMS: 45000,
  bufferCommands: true,
  maxPoolSize: 10,
};

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start server
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, mongoOptions);
    console.log("MongoDB Connected Successfully!");
    
    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

startServer();
