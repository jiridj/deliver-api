const fs = require('fs');
const Product = require('../lib/model/product');

const load = async () => {
  const raw = fs.readFileSync('data/products.json');
  const data = JSON.parse(raw);

  let promises = [];

  data.forEach((element) => {
    const product = new Product(element);
    promises.push(product.save());
  });

  await Promise.all(promises).then(() => {
    return;
  });
};

module.exports = { load };
