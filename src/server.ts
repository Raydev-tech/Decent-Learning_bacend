
import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import courseRoutes from "./routes/courseRoutes";

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 5000;

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://decent-learning.vercel.app",
  "https://instructor-decent.vercel.app",
];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin (e.g. Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked this origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/student", dashboardRoutes);
app.use("/api/courses", courseRoutes);

// Test route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Decent Learning API 🚀",
  });
});

// Connect to MongoDB before starting the server
const startServer = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from environment variables");
    }

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected successfully!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Decent Learning API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

// Start server
startServer();

export default app;
