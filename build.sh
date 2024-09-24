#!/usr/bin/bash
set -e

docker build . -t docker-carmentis-app-hello-world
docker run --rm -d -p 8000:8000 docker-carmentis-app-hello-world