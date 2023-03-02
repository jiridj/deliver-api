const express = require('express');

const AppError = require('../errors/app-error');
const User = require('../model/user');
const logger = require('../logging/logger');

module.exports = class UserController {
  router = express.Router();

  constructor() {
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.delete('/', this.deleteUser);
    this.router.get('/', this.getUser);
    this.router.put('/', this.updateUser);
  }

  async deleteUser(req, res, next) {
    try {
      // Delete the active user
      const body = req.body;
      if (req.user.email != body.email) {
        logger.warn('Attempt to update another user');
        return next(AppError.forbidden());
      }

      const user = await User.findByEmail(body.email);
      if (user) {
        await user.delete();
        return res.status(200).send();
      } else return AppError.notFound('User');
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      // Find the active user's details
      const user = await User.findByEmail(req.user.email);
      if (user) return res.status(200).send(user);
      else return AppError.notFound('User');
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  }

  // BUG: API6:2019 Mass assignment
  // A lack of input validation enables you to assign
  // yourself admin privileges (role = 'admin'). Once
  // you have admin privileges you have access to all
  // user data.
  async updateUser(req, res, next) {
    try {
      // Update the active user's details
      const body = req.body;

      if (req.user.email != body.email) {
        logger.warn('Attempt to update another user');
        return next(AppError.forbidden());
      }

      let user = await User.findByEmail(body.email);
      if (user) {
        if (body.password) user.password = body.password;
        if (body.role) user.role = body.role;
        if (body.first_name) user.first_name = body.first_name;
        if (body.last_name) user.last_name = body.last_name;
        if (body.address) user.address = body.address;
        if (body.city) user.city = body.city;
        if (body.country) user.country = body.country;
        if (body.phone) user.phone = body.phone;
        user = await user.save();
        return res.status(200).send(user);
      } else {
        return next(AppError.notFound('User'));
      }
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  }
};
