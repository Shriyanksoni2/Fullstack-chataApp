import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import cookieParser  from "cookie-parser";
import messageRoutes from "./routes/message.route.js"
import { app, server } from './lib/socket.js';
import cors from "cors"
import path from 'path';
import fallback from 'express-history-api-fallback';
import { fileURLToPath } from 'url';


dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const PORT = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

if (process.env.NODE_ENV === "production") {
  const staticPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(staticPath));
  app.use(fallback('index.html', { root: staticPath }));
}

server.listen(5001, () => {
    console.log('Server is running on port', PORT);
    connectDB();
}); 