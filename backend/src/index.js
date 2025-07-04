import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import cookieParser  from "cookie-parser";
import messageRoutes from "./routes/message.route.js"
import { app, server } from './lib/socket.js';
import cors from "cors"
import path from 'path';

dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve()

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

if (process.env.NODE_ENV === 'production') {
  const root = path.join(__dirname, '../frontend/dist');
  const fallback = require('express-history-api-fallback');

  app.use(express.static(root));
  app.use(fallback('index.html', { root }));
}

server.listen(5001, () => {
    console.log('Server is running on port', PORT);
    connectDB();
}); 