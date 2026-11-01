import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// Оновлення аватара користувача
export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }

  const result = await saveFileToCloudinary(req.file.buffer, req.user._id);

  await User.updateOne(
    { _id: req.user._id },
    { avatar: result.secure_url },
  );

  res.status(200).json({
    url: result.secure_url,
  });
};
