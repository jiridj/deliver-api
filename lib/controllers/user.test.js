const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const request = require('supertest');

const AuthController = require('./auth');
const UserController = require('./user');

const app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/auth', new AuthController().router);
app.use(
  '/user',
  passport.authenticate('jwt', { session: false }),
  new UserController().router,
);

const db = require('../../test/database');
const users = require('../../test/users');

afterAll(async () => {
  await db.dropDb();
});

beforeAll(async () => {
  await db.setUp();
  await users.load();
});

describe('test user controller', () => {
  it('should fail when not logged in', async () => {
    const res = await request(app).get('/user');
    expect(res.statusCode).toBe(401);
  });

  it('should return details for the logged in user', async () => {
    let res = await request(app).post('/auth/login').send({
      email: 'overrillo0@redcross.org',
      password: 'QkYvxNZUiP',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).not.toBeUndefined();

    res = await request(app)
      .get('/user')
      .set('Authorization', 'Bearer ' + res.body.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('overrillo0@redcross.org');
  });

  it('should fail to delete another user', async () => {
    let res = await request(app).post('/auth/login').send({
      email: 'overrillo0@redcross.org',
      password: 'QkYvxNZUiP',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).not.toBeUndefined();

    res = await request(app)
      .delete('/user')
      .send({ email: 'someotheruser@gmail.com' })
      .set('Authorization', 'Bearer ' + res.body.token);
    expect(res.statusCode).toBe(403);
  });

  it('should fail to update details for another user', async () => {
    let res = await request(app).post('/auth/login').send({
      email: 'overrillo0@redcross.org',
      password: 'QkYvxNZUiP',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).not.toBeUndefined();

    res = await request(app)
      .put('/user')
      .send({
        email: 'someotheruser@gmail.com',
        first_name: 'test',
      })
      .set('Authorization', 'Bearer ' + res.body.token);
    expect(res.statusCode).toBe(403);
  });

  it('should update and delete the logged in user', async () => {
    const signup = await request(app).post('/auth/signup').send({
      email: 'test_user_update_delete@deliver.api',
      password: 'password123#',
    });
    expect(signup.statusCode).toBe(200);

    const login = await request(app).post('/auth/login').send({
      email: 'test_user_update_delete@deliver.api',
      password: 'password123#',
    });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).not.toBeUndefined();

    let res = await request(app)
      .put('/user')
      .send({
        email: 'test_user_update_delete@deliver.api',
        first_name: 'test',
        last_name: 'user',
      })
      .set('Authorization', 'Bearer ' + login.body.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.first_name).toBe('test');
    expect(res.body.last_name).toBe('user');

    res = await request(app)
      .delete('/user')
      .send({ email: 'test_user_update_delete@deliver.api' })
      .set('Authorization', 'Bearer ' + login.body.token);
    expect(res.statusCode).toBe(200);
  });
});
