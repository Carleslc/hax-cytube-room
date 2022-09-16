# hax-cytube-room
HaxBall room for https://cytu.be/r/haxb

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/carleslc)

## Play

👉 **https://www.haxball.com/play?c=5PHrrBIBMxA** 🔐 _hax-cytube_

## Install

#### **[`node`](https://nodejs.org/es/download/) & [`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)**

_Only if you're not using the Docker image_

```sh
# Install dependencies
npm install

# Set executable permissions to the start script
chmod +x start.sh
```

## Run

1. Get your token at https://www.haxball.com/headlesstoken
2. Run `./start.sh TOKEN` replacing `TOKEN` with your token

The room will be open as long as you have the node process running.
You can stop it with _Ctrl^C_.

You can run it in detach mode with `./start.sh TOKEN &`.
You can stop it looking for the `PID` of the `node ./src/room.js` process using `ps` and then using `kill PID`.

## Docker

Optionally, you can run this room as a [Docker](https://www.docker.com/) image.

### Build image

This is needed only the first time or to update the source files if they change.

```sh
# Create the Docker image
# --build-arg binds the Dockerfile args
# -t is the image name
# last parameter is the location of the Dockerfile (.)
docker build --build-arg ROOM=hax-cytube-room -t hax-cytube-room .
```

### Run the container

This will create and start the container, opening the room.

Replace `$TOKEN` with your HaxBall token from https://www.haxball.com/headlesstoken

```sh
# Run a docker container with the generated image
# -d is detached (parallel process)
# --name is the container name
# -e TOKEN=$TOKEN passes the $TOKEN as an environment variable
# last parameter is the image name
docker run -d --name hax-cytube-room -e TOKEN=$TOKEN hax-cytube-room
```

You can also set the token as an environment variable in your host, replacing `$TOKEN`:

```sh
export TOKEN=$TOKEN
```

If you set the token in your host then you do not need to replace `$TOKEN` in the `docker run` command of above.

_You get an error like `docker: Error response from daemon: Conflict. The container name "/hax-cytube-room" is already in use by container`_ ?

Remove the container first and try again:

```sh
docker rm hax-cytube-room
```

### Get the room link

You can see the container logs with:

```sh
# -f means persistent (wait for new logs until you press Ctrl^C)
# --tail 1000 to show only the latest 1000 lines
docker logs -f hax-cytube-room --tail 1000
```

### Stop the container

This will close the room and stop the container.

```sh
docker stop hax-cytube-room
```

### Restart the container

Open the room again after the container was stopped.

```sh
docker start hax-cytube-room
```

If you get an `Error: Invalid Token Provided!` you need to remove the container and recreate it with a new token.

### Remove the container

Clean the container. You can recreate it with the run command.

```sh
docker rm hax-cytube-room

# If the room is open you can close it, stop and remove the container
docker rm hax-cytube-room --force
```
