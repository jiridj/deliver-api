const fs = require('fs');
const User = require('../lib/model/user');

const load = async () => {
  const raw = fs.readFileSync('data/users-10.json');
  const data = JSON.parse(raw);

  let promises = [];

  data.forEach((element) => {
    const user = new User(element);
    promises.push(user.save());
  });

  await Promise.all(promises).then(() => {
    return;
  });
};

module.exports = { load };
