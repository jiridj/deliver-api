const express = require('express');

const AppError = require('../errors/app-error');
const Order = require('../model/order');
const logger = require('../logging/logger');

module.exports = class OrderController {
  router = express.Router();

  constructor() {
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get('/', this.getOrdersForUser);
    this.router.get('/:orderNumber', this.getOrder);
    this.router.post('/', this.addOrder);
  }

  async addOrder(req, res, next) {
    try {
      // TODO: implement logic for adding an order
      return res.status(200).send();
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  }

  async getOrdersForUser(req, res, next) {
    try {
      const result = await Order.findByUser(req.user);
      return res.status(200).send(result);
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  }

  // BUG: API1:2019 Broken object-level authorization
  // Users should not be able to query any orders other than
  // their own. This method does not validate if the order
  // retrieve actually belongs to the logged in user. The linked
  // user document is also automatically populated. With simple
  // brute-force enumeration of the order number an attacker
  // can access sensitive data of other users.
  // BUG: API-3:2019 Excessive data exposure
  // The linked user document contains sensitive data that is
  // returned to the client.
  async getOrder(req, res, next) {
    try {
      const result = await Order.findByNumber(parseInt(req.params.orderNumber));
      if (result) return res.status(200).send(result);
      else return next(AppError.notFound('Order'));
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  }
};
