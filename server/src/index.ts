import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import router from "./routes/chat.routes";

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

const app = express();

// Trust the first proxy to get correct client IP when behind a reverse proxy like nginx
app.set("trust proxy", 1);

//security middlewares
app.use(helmet());

//logging middleware
app.use(morgan("combined"));

//body parsing middlewares
app.use(express.json({ limit: "1mb" }));

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: [process.env.FRONTEND_BASE_URL || "http://localhost:5173"],
    credentials: true,
  }),
);
// Cookie parsing middleware
app.use(cookieParser());

// Rate limiting middleware
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

// ✅ Health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is running 🚀" });
});

// ✅ Routes
app.use("/api/", router);

//404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down...");
  server.close(() => {
    console.log("Closed all connections");
    process.exit(0);
  });
});
