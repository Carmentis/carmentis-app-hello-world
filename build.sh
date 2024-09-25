#!/usr/bin/bash
set -e

# delete existing running containers

existingContainers=$(docker ps -a -q --filter="ancestor=docker-carmentis-app-hello-world")
if [ $existingContainers ]; then
  echo "[Carmentis - Hello World] Deleting existing containers"
  docker rm -f "$existingContainers"
else
  echo "[Carmentis - Hello World] No container found, done"
fi

# start the docker
docker build . -t docker-carmentis-app-hello-world
docker run --rm -d  -p 8000:8000 --name container-carmentis-app-hello-world docker-carmentis-app-hello-world