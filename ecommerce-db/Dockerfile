FROM postgres:13.1-alpine

USER postgres

COPY ecommerce.sql ./

# TODO: run ecommerce.sql to add data to postgres
# Currently manual through the following:
# 1. docker exec -it <CONTAINER_ID> /bin/bash
# 2. cat ecommerce.sql | psql -U <postgres username> <databasename>
# RUN ["/bin/bash" "-c" "ecommerce.sql | psql -U postgres ecommercedb"]

EXPOSE 8080