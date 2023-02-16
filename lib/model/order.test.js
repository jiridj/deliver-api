const User = require('./user');
const Product = require('./product');
const Order = require('./order');

const db = require('../../test/database');
const users = require('../../test/users');
const products = require('../../test/products');

let user = undefined;

afterAll(async () => {
  await db.dropDb();
});

beforeAll(async () => {
  await db.setUp();
  await users.load();
  await products.load();

  const p9 = await Product.findByNumber(9);
  const p13 = await Product.findByNumber(13);
  const p14 = await Product.findByNumber(14);

  user = await User.findByEmail('sbugg0@msn.com');

  const o1 = new Order({
    number: 1,
    user,
    orderLines: [
      { product: p9, quantity: 5 },
      { product: p13, quantity: 3 },
      { product: p14, quantity: 2 },
    ],
  });
  await o1.save();

  const o2 = new Order({
    number: 2,
    user,
    orderLines: [
      { product: p13, quantity: 2 },
      { product: p14, quantity: 3 },
    ],
  });
  await o2.save();
});

describe('test order model', () => {
  it('should find one order by number', async () => {
    const order = await Order.findByNumber(2);
    expect(order.user.email).toBe('sbugg0@msn.com');
    expect(order.orderLines.length).toBe(2);
  });

  it('should find all orders by user', async () => {
    const orders = await Order.findByUser(user);
    expect(orders[0].user.email).toBe('sbugg0@msn.com');
    expect(orders[0].orderLines.length).toBe(3);
  });
});
