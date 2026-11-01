
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware
app.use(logger);
app.use(express.json());
app.use(cors());

// Маршрути нотаток
app.use(notesRoutes);

// Обробка помилок
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

// Підключаємо базу даних перед запуском сервера
const startServer = async () => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
