mongoimport --uri mongodb://deliver-api:s3cr3t@mongo-db:27017/deliver --collection products --drop --file /data/export/products 
mongoimport --uri mongodb://deliver-api:s3cr3t@mongo-db:27017/deliver --collection users --drop --file /data/export/users
mongoimport --uri mongodb://deliver-api:s3cr3t@mongo-db:27017/deliver --collection orders --drop --file /data/export/orders