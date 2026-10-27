import { Router } from 'express'; // Імпортуємо Router з express для створення маршрутизатора
import { 
	getStudents, // Додано імпорт контролера для отримання всіх студентів
	getStudentById, // Додано імпорт контролера для отримання студента за ID
  getStudentsByGender, // Додано імпорт контролера для отримання студентів за статтю
  getStudentsByName, // Додано імпорт контролера для отримання студентів за іменем
  getStudentsByNameFromBody, // Додано імпорт контролера для отримання студентів за іменем з body 
  createStudent, // Додано імпорт контролера для створення нового студента
} from '../controllers/studentsController.js'; // Імпортуємо контролери для роботи з студентами

const router = Router(); // Створюємо роутер для студентів

router.get('/students', getStudents); // Додано маршрут для отримання всіх студентів
router.get('/students/gender/:gender', getStudentsByGender); // Додано маршрут для отримання студентів за статтю із урла
router.get('/students/name/:name', getStudentsByName); // Додано маршрут для отримання студентів за іменем із урла
router.get('/students/:studentId', getStudentById); // Додано маршрут для отримання студента за ID із урла

router.post('/students/name', getStudentsByNameFromBody); // Додано маршрут для отримання студентів за іменем із body запиту (POST-запит)
router.post('/students', createStudent); // Додано маршрут для створення нового студента

router.delete('/students/:studentId', deleteStudent); // Додано маршрут для видалення студента за ID

router.patch('/students/:studentId', updateStudent); // Додано маршрут для оновлення студента за ID

export default router; // Експортуємо роутер для використання у server.js
