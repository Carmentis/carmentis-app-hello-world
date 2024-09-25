#!/usr/bin/bash
set -e

IMAGE_NAME=docker-carmentis-app-hello-world
CONTAINER_NAME=container-carmentis-app-hello-world


# delete existing running containers
docker rm "$(docker ps -a -q --filter="ancestor=$IMAGE_NAME")"

# start the docker
docker build . -t $IMAGE_NAME
docker run --rm -d --name $CONTAINER_NAME  -p 8000:8000 $IMAGE_NAME