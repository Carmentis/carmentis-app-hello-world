#!/usr/bin/bash
set -e

# delete existing running containers
docker rm -f "$(docker ps -a -q --filter="ancestor=docker-carmentis-app-hello-world")"

# start the docker
docker build . -t docker-carmentis-app-hello-world
docker run --rm -d  -p 8000:8000 --name container-carmentis-app-hello-world docker-carmentis-app-hello-world