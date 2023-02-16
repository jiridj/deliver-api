const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = mongoose.Types;

const orderLine = new Schema({
  product: { type: Types.ObjectId, ref: 'product' },
  quantity: { type: Number },
});

const order = new Schema({
  number: { type: Number, required: true, index: { unique: true } },
  user: { type: Types.ObjectId, ref: 'user' },
  orderLines: [orderLine],
});

order.statics.findByNumber = async function (number) {
  return this.findOne({ number })
    .populate('user')
    .populate({
      path: 'orderLines',
      populate: {
        path: 'product',
      },
    });
};

order.statics.findByUser = async function (user) {
  return this.find({ user })
    .populate('user')
    .populate({
      path: 'orderLines',
      populate: {
        path: 'product',
      },
    });
};

module.exports = mongoose.model('order', order);
