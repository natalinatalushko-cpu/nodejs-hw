import createHttpError from 'http-errors';

import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { accessToken, sessionId } = req.cookies;

  if (!accessToken) {
    return next(createHttpError(401, 'Missing access token'));
  }

  if (!sessionId) {
    return next(createHttpError(401, 'Session not found'));
  }

  let session;
  try {
    session = await Session.findOne({ _id: sessionId, accessToken });
  } catch {
    session = null;
  }

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isTokenExpired = new Date() > new Date(session.accessTokenValidUntil);
  if (isTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);
  if (!user) {
    return next(createHttpError(401));
  }

  req.user = user;
  next();
};
