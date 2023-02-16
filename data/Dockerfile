FROM mongo

COPY import.sh /data/import.sh
COPY products.json /data/products.json
COPY users-hashed.json /data/users.json

CMD /data/import.sh