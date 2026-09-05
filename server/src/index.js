import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

import { getHealth } from './controllers/health.controller.js';
import authRoutes from './routes/auth.routes.js';
import menuRoutes from './routes/menu.routes.js';
import orderRoutes from './routes/orders.routes.js';

dotenv.config({ override: true });

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const clientOrigin = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', getHealth);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server.',
  });
});

const startServer = async () => {
  const connection = await connectDB();

  if (connection.connection.readyState !== 1) {
    throw new Error('MongoDB connection is not ready.');
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Unable to start server:', error);
  process.exit(1);
});