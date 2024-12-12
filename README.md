# hax-cytube-room
HaxBall room for https://cytu.be/r/haxb

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/carleslc)

## Install

First, clone this repository and move to the `hax-cytube-room` folder:

```sh
# Clone the repository
git clone https://github.com/Carleslc/hax-cytube-room.git

# Move to the repository folder
cd hax-cytube-room
```

_If using Docker, skip the following section._

Install **[`node`](https://nodejs.org/es/download/)** and **[`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)**.

You can install _node_ and _npm_ using [**`nvm`** (Node Version Manager)](https://github.com/nvm-sh/nvm?tab=readme-ov-file):

If using _Bash / Zsh_ shell, install [`nvm`](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) with:

```sh
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

If using _Fish_ shell, install [`nvm.fish`](https://github.com/jorgebucaran/nvm.fish?tab=readme-ov-file) with [`fisher`](https://github.com/jorgebucaran/fisher?tab=readme-ov-file):

```sh
# Install fisher
curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/main/functions/fisher.fish | source && fisher install jorgebucaran/fisher

# Install nvm.fish
fisher install jorgebucaran/nvm.fish
```

Then install _node_ and _npm_ using `nvm` with:

```sh
# Bash / Zsh
nvm install --lts
nvm use --lts

# Fish
nvm install lts
nvm use lts
```

See installed versions:

```sh
node --version
npm --version
```

Install dependencies in this folder:

```sh
npm install
```

Set executable permissions to the start script:

```sh
chmod +x start.sh
```

## Run

1. Get your token at:

    https://www.haxball.com/headlesstoken

2. Run `./start.sh $TOKEN`

    Replace `$TOKEN` with your token.

You can also set the token as an environment variable in your host:

```sh
# Bash / Zsh
export TOKEN=$TOKEN

# Fish
set -x TOKEN $TOKEN
```

If you set the token in your host then you do **not** need to replace `$TOKEN` in the start command.

The room will be open as long as you have the node process running.

You can stop the room with _Ctrl^C_.

### Configure the room name and password

_This step is optional._

Set room name and password with these optional environment variables before starting the room:

- `ROOM` to set the room name

    Default: `CyTube /haxb/`

- `ROOM_PASSWORD` to set the room password

    Default: `hax-cytube`

```sh
# Bash / Zsh
export ROOM="CyTube /haxb/"
export ROOM_PASSWORD=hax-cytube

# Fish
set -x ROOM "CyTube /haxb/"
set -x ROOM_PASSWORD hax-cytube
```

### Run in background

You can start the room in detach mode with:

```sh
./start.sh $TOKEN > room.log 2>&1 & disown
```

#### Get the room link

You can see the logs with:

```sh
# -f means persistent (wait for new logs until you press Ctrl^C)
# -n1000 to show only the latest 1000 lines
tail -f -n1000 room.log
```

#### Stop the room

You can stop the room in background looking for the `PID` of the `node ./src/room.js` process using `ps` command and then using `kill PID`:

```sh
# Find the PID of the node process
ps -e | grep node

# Stop the node process (replace PID with the process number)
kill PID
```

If you want to remove the logs:

```sh
rm room.log
```

### Run in background (Screen)

You can also run and manage the room using [`screen`](https://www.gnu.org/software/screen/manual/screen.html) commands:

```sh
# Create a screen and run the room in background
# -S is the screen name
# -d -m is detached mode (parallel process) to run the room in background
screen -S hax-cytube-room -d -m ./start.sh $TOKEN
```

List the active screens:

```sh
screen -ls
```

Enter the screen to see the logs with:

```sh
screen -r hax-cytube-room
```

Stop the screen with _Ctrl^C_ inside the screen.

Exit the screen without stopping it with _Ctrl^A + D_.

Remove the screen and stop the room with this command outside the screen:

```sh
screen -X -S hax-cytube-room quit
```

## Docker

Optionally, you can also run the room using a [Docker](https://www.docker.com/) image.

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
# -e ROOM sets the room name
# -e ROOM_PASSWORD sets the room password
# last parameter is the image name
docker run -d --name hax-cytube-room -e ROOM="CyTube /haxb/" -e ROOM_PASSWORD=hax-cytube -e TOKEN=$TOKEN hax-cytube-room
```

You can replace the `ROOM_PASSWORD` and `ROOM` with your own values for the room password and room name.

You can also set the token as an environment variable in your host, replacing `$TOKEN`:

```sh
export TOKEN=$TOKEN
```

If you set the token in your host then you do **not** need to replace `$TOKEN` in the `docker run` command above.

### Get the room link

You can see the container logs with:

```sh
# -f means persistent (wait for new logs until you press Ctrl^C)
# -t to show the timestamp for each line
# --tail 1000 to show only the latest 1000 lines
docker logs -f -t --tail 1000 hax-cytube-room
```

### See the running containers

```sh
docker ps

# See also the stopped containers
docker ps -a
```

You should see something like this:

```sh
CONTAINER ID   IMAGE                   COMMAND                  CREATED          STATUS          PORTS     NAMES
57e0b4582027   hax-cytube-room         "./start.sh"             5 minutes ago    Up 5 minutes              hax-cytube-room
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

_You get an error like `docker: Error response from daemon: Conflict. The container name "/hax-cytube-room" is already in use by container`_ ?

Remove the container first and try again.

### Remove the container

Clean the container. You can recreate it with the run command.

```sh
docker rm hax-cytube-room

# If the room is open you can close it, stop and remove the container
docker rm hax-cytube-room --force
```
