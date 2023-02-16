const bcrypt = require('bcrypt');
const fs = require('fs');

const raw_data = fs.readFileSync('./users.json');
const users = JSON.parse(raw_data);

for (const user of users) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
}

fs.writeFileSync(
  './users-hashed.json',
  JSON.stringify(users, null, 2),
  'utf-8',
);
