deliver = db.getSiblingDB('deliver');

// create the API user
deliver.createUser({
  user: 'deliver-api',
  pwd: 's3cr3t',
  roles: [
    {
      role: 'readWrite',
      db: 'deliver',
    },
  ],
});
