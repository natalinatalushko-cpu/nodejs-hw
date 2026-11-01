import assert from 'node:assert/strict';
import { test, afterEach } from 'node:test';
import { Note } from './src/models/note.js';
import { Session } from './src/models/session.js';
import { User } from './src/models/user.js';
import { authenticate } from './src/middleware/authenticate.js';
import { refreshUserSession } from './src/controllers/authController.js';
const original = { find: Session.findOne, del: Session.deleteOne, user: User.findById };
afterEach(() => { Session.findOne = original.find; Session.deleteOne = original.del; User.findById = original.user; });
const id = '507f1f77bcf86cd799439011';
async function auth(cookies) {
  let error; let called = false; const req = { cookies };
  await authenticate(req, {}, e => { error = e; called = true; });
  return { error, called, req };
}
test('Індекс містить tag і userId', () => {
  assert.ok(Note.schema.indexes().some(([i]) => i.tag === 1 && i.userId === 1));
});
test('Відсутній accessToken: 401', async () => {
  assert.equal((await auth({ sessionId: id })).error.status, 401);
});
test('Відсутній або некоректний sessionId: 401 без запиту до БД', async () => {
  Session.findOne = () => { throw Error('Unexpected query'); };
  for (const sessionId of [undefined, 'invalid']) assert.equal((await auth({ accessToken: 'a', sessionId })).error.status, 401);
});
test('Сесія шукається за обома cookies; чужа пара відхиляється', async () => {
  Session.findOne = async filter => { assert.deepEqual(filter, { _id: id, accessToken: 'a' }); return null; };
  assert.equal((await auth({ sessionId: id, accessToken: 'a' })).error.message, 'Session not found');
});
test('Чинна сесія надає користувача', async () => {
  Session.findOne = async () => ({ userId: id, accessTokenValidUntil: new Date(Date.now() + 60000) });
  User.findById = async () => ({ _id: id });
  const result = await auth({ sessionId: id, accessToken: 'a' });
  assert.equal(result.error, undefined); assert.equal(result.req.user._id, id); assert.ok(result.called);
});
test('Прострочений accessToken: 401', async () => {
  Session.findOne = async () => ({ accessTokenValidUntil: new Date(0) });
  assert.equal((await auth({ sessionId: id, accessToken: 'a' })).error.message, 'Access token expired');
});
test('Прострочений refresh: видалення сесії, очищення cookies, потім 401', async () => {
  const events = [];
  Session.findOne = async filter => { assert.deepEqual(filter, { _id: id, refreshToken: 'r' }); return { _id: id, refreshTokenValidUntil: new Date(0) }; };
  Session.deleteOne = async filter => { assert.deepEqual(filter, { _id: id }); events.push('delete'); };
  const res = { clearCookie(name, options) { assert.deepEqual(options, { httpOnly: true, secure: true, sameSite: 'none' }); events.push(name); } };
  await assert.rejects(() => refreshUserSession({ cookies: { sessionId: id, refreshToken: 'r' } }, res), e => e.status === 401 && e.message === 'Session token expired');
  assert.deepEqual(events, ['delete', 'sessionId', 'accessToken', 'refreshToken']);
});
