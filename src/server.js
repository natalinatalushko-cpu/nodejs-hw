import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import studentsRoutes from './routes/studentsRoutes.js';

import pinoHttp from 'pino-http';
import { isValidObjectId } from 'mongoose';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Глобальні middleware

// Логер дозволяє відстежувати всі запити до сервера: метод (GET, POST), шлях, статус відповіді, час виконання.
// Ми використовуємо pino-pretty, щоб логи в консолі були кольоровими та зручними для читання.
// Логер треба підключати одним із перших middleware, щоб він бачив усі запити та помилки.

// Чому порядок важливий?
// Logger першим → логуються всі вхідні запити.
// JSON і CORS далі → кожен запит обробляється перед передачею в маршрути.
// Маршрути → відповідають на конкретні запити.
// 404 handler → якщо маршрут не знайдено.
// Error handler → якщо трапилась помилка на будь-якому етапі.
  
app.use(logger);         // 1. Логер першим — бачить усі запити
// app.use(express.json()); // 2. Парсинг JSON-тіла. // ця middleware "вчить" Express розуміти JSON у тілі запиту
app.use(express.json({
  type: ['application/json', 'application/vnd.api+json'],
  // limit: '100kb', // максимум 100 кілобайт
}));
app.use(cors());         // 3. Дозвіл для запитів з інших доменів

app.use(pinoHttp());

// ...тут ваші маршрути

// підключаємо групу маршрутів студента
app.use(studentsRoutes);

// 404 — якщо маршрут не знайдено
app.use(notFoundHandler);

// Error — якщо під час запиту виникла помилка
app.use(errorHandler);

// Підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* Маршрути */

// Отримати всіх студентів
// app.get('/students', async (req, res, next) => {
//   try {
//     const students = await Student.find();
//     res.status(200).json(students);
//   } catch (error) {
//     next(error);
//   }
// });

// Отримати студента за статтю
// app.get('/students/gender/:gender', async (req, res, next) => {
//   try {
//     const { gender } = req.params;
//     const students = await Student.find({ gender });

//     res.status(200).json(students);
//   } catch (error) {
//     next(error);
//   }
// });

// Отримати студента за ID
// app.get('/students/:studentId', async (req, res, next) => {
//   try {
//     const { studentId } = req.params;

//     // Перевіряємо формат ID
//     if (!isValidObjectId(studentId)) {
//       return res.status(400).json({
//         message: 'Invalid student ID',
//       });

//     const student = await Student.findById(studentId);

//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
      
//     }
//     res.status(200).json(student);
//   } catch (error) {
//     next(error);
//   }
// });

// Отримати всі нотатки
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

// Отримати нотатку за ID
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// Перевірити обробку помилок
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

/* Обробка помилок */

// Якщо маршрут не знайдено
// app.use((req, res) => {
//   res.status(404).json({
//     message: 'Route not found',
//   });
// });

// Обробник помилок сервера
// app.use((err, req, res, next) => {
//   res.status(500).json({
//     message: err.message,
//   });
// });

// Middleware для обробки помилок
// app.use((err, req, res, next) => {
//   console.error(err);

//   const isProd = process.env.NODE_ENV === "production";

//   res.status(500).json({
//     message: isProd
//       ? "Something went wrong. Please try again later."
//       : err.message,
//   });
// });

// Така організація коду створює зрозумілу структуру проєкту:
// server.js відповідає за складання застосунку та запуск сервера;
// роутери містять логіку для роботи з конкретними сутностями (у нашому випадку — студентами);
// моделі визначають доступ до бази даних.
// Цей підхід робить код більш чистим, масштабованим і зручним у підтримці.
