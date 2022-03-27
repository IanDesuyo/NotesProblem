# Mongo DB

JWT_SECRET=***REMOVED***

```
docker run --name notesproblemdb \
-e MONGO_INITDB_ROOT_USERNAME=root \
-e MONGO_INITDB_ROOT_PASSWORD=root \
-v /home/ian/.docker/notesproblemdb:/data/db \
--network notesproblem-network \
-p 8780:27017 \
-d \
mongo:latest

docker run --name notesproblemdb-express \
--network notesproblem-network \
-e ME_CONFIG_MONGODB_SERVER=notesproblemdb \
-e ME_CONFIG_MONGODB_ADMINUSERNAME=root \
-e ME_CONFIG_MONGODB_ADMINPASSWORD=root \
-e ME_CONFIG_BASICAUTH_USERNAME=root \
-e ME_CONFIG_BASICAUTH_PASSWORD=root \
-p 8781:8081 \
-d \
mongo-express:latest
```
