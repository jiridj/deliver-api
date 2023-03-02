const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const request = require('supertest');

const AppError = require('../errors/app-error');

const AuthController = require('./auth');
const AdminController = require('./admin');

const app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/auth', new AuthController().router);
app.use(
  '/admin',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    if (req.user && req.user.role && req.user.role === 'admin') return next();
    else return next(AppError.unauthorized('Admin privileges required'));
  },
  new AdminController().router,
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

describe('test admin controller', () => {
  it('should not allow none admins access', async () => {
    let res = await request(app).post('/auth/login').send({
      email: 'overrillo0@redcross.org',
      password: 'QkYvxNZUiP',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).not.toBeUndefined();

    res = await request(app)
      .get('/admin/user')
      .set('Authorization', 'Bearer ' + res.body.token);
    expect(res.statusCode).toBe(401);
  });

  it('should get the first page of users', async () => {
    let res = await request(app).post('/auth/login').send({
      email: 'admin@deliver.api',
      password: 's3cr3t',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).not.toBeUndefined();

    res = await request(app)
      .get('/admin/user')
      .set('Authorization', 'Bearer ' + res.body.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.size).toBe(10);
    expect(res.body.total).toBe(11);
    expect(res.body.users.length).toBe(10);
  });

  it('should get the second page of 5 users', async () => {
    let res = await request(app).post('/auth/login').send({
      email: 'admin@deliver.api',
      password: 's3cr3t',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).not.toBeUndefined();

    res = await request(app)
      .get('/admin/user')
      .query({ page: 2, size: 5 })
      .set('Authorization', 'Bearer ' + res.body.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.size).toBe(5);
    expect(res.body.total).toBe(11);
    expect(res.body.users.length).toBe(5);
  });

  it('should return an empty third page', async () => {
    let res = await request(app).post('/auth/login').send({
      email: 'admin@deliver.api',
      password: 's3cr3t',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).not.toBeUndefined();

    res = await request(app)
      .get('/admin/user')
      .query({ page: 3, size: 10 })
      .set('Authorization', 'Bearer ' + res.body.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(3);
    expect(res.body.size).toBe(10);
    expect(res.body.total).toBe(11);
    expect(res.body.users.length).toBe(0);
  });

  it('should get a users details', async () => {
    const login = await request(app).post('/auth/login').send({
      email: 'admin@deliver.api',
      password: 's3cr3t',
    });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).not.toBeUndefined();

    const res = await request(app)
      .get('/admin/user/overrillo0@redcross.org')
      .set('Authorization', 'Bearer ' + login.body.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.first_name).toBe('Odille');
  });

  it('should create, update and delete a user', async () => {
    const login = await request(app).post('/auth/login').send({
      email: 'admin@deliver.api',
      password: 's3cr3t',
    });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).not.toBeUndefined();

    const create = await request(app)
      .post('/admin/user')
      .send({
        email: 'test_user_admin@deliver.api',
        password: 'password123#',
      })
      .set('Authorization', 'Bearer ' + login.body.token);
    expect(create.statusCode).toBe(200);

    const update = await request(app)
      .put('/admin/user')
      .send({
        email: 'test_user_admin@deliver.api',
        first_name: 'test',
        last_name: 'user',
      })
      .set('Authorization', 'Bearer ' + login.body.token);
    expect(update.statusCode).toBe(200);
    expect(update.body.first_name).toBe('test');
    expect(update.body.last_name).toBe('user');

    const res = await request(app)
      .delete('/admin/user/test_user_admin@deliver.api')
      .set('Authorization', 'Bearer ' + login.body.token);
    expect(res.statusCode).toBe(200);
  });
});
