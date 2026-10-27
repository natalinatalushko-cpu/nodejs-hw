import createHttpError from 'http-errors'

import { Student } from '../models/student.js';

// Отримати список усіх студентів з урла /students
export const getStudents = async (req, res) => {
  const students = await Student.find();
  res.status(200).json(students);
};

// Отримати одного студента за id з урла /students/:studentId
export const getStudentById = async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId);

if (!student) {
  throw createHttpError(404, 'Student not found');
}

  res.status(200).json(student);
}; 

//   if (!student) {
//     return res.status(404).json({ message: 'Student not found' });
//   }

//   res.status(200).json(student);
  // };

// Отримати студента за статтю
export const getStudentsByGender = async (req, res, next) => {
  try {
    const { gender } = req.params;
    const students = await Student.find({ gender });

    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

const controller = (req, res) => {
  const body = req.body;
};

// Отримати студента за іменем з урла /students/name/:name

export const getStudentsByName = async (req, res) => {
  const { name } = req.params;
  const students = await Student.find({ name });

  if (!students || students.length === 0) {
    throw createHttpError(404, 'Students not found');
  }

  res.status(200).json(students);
};


//Отримуємо студента за іменем з body запиту (POST-запит) /students/name
export const getStudentsByNameFromBody = async (req, res) => {
  const { name } = req.body;
  const students = await Student.find({ name });

  if (students.length === 0) {
    throw createHttpError(404, 'Students not found');
  }

  res.status(200).json(students);
};


// Дописуємо контролер у файл src/controllers/studentsController.js. Він читає дані з req.body і створює документ через Student.create(...). Для запитів, які щось створюють, семантично правильно відправляти відповідь зі статус-кодом 201 Created.
// import { Student } from '../models/student.js';
// Решта контролерів
// Новий контролер
export const createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
};

// Контролер для видалення студента за ID
export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findOneAndDelete({
    _id: studentId,
  });

  if (!student) {
    throw createHttpError(404, "Student not found");
  }

  res.status(200).json(student);
};

// Контролер для оновлення студента за ID
export const updateStudent = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndUpdate(
    { _id: studentId }, // Шукаємо по id
    req.body,
    { returnDocument: "after" }, // повертаємо оновлений документ
  );

  if (!student) {
	throw createHttpError(404, 'Student not found');
  }

  res.status(200).json(student);
};
