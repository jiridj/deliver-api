const express = require('express');

const AppError = require('../errors/app-error');
const Product = require('../model/product');
const logger = require('../logging/logger');

module.exports = class ProductController {
  router = express.Router();

  constructor() {
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get('/', this.getAllProducts);
    this.router.get('/:productNumber', this.getProduct);
  }

  async getAllProducts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;

      const result = await Product.query(page, size);
      return res.status(200).send(result);
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  }

  async getProduct(req, res, next) {
    try {
      const result = await Product.findByNumber(
        parseInt(req.params.productNumber),
      );
      if (result) return res.status(200).send(result);
      else return next(AppError.notFound('Product'));
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  }
};
