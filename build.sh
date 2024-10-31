#!/usr/bin/bash
#
# Copyright (c) Carmentis. All rights reserved.
# Licensed under the Apache 2.0 licence.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
# OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#

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