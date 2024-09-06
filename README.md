# html解析服务端API

## Installation

```shell
$ pnpm install
```

## Running the app

```shell
# development
$ pnpm start

# watch mode
$ pnpm start:dev
$ pnpm dev

# production mode
$ pnpm start:prod
```

## Deployment

```shell
# Start Service
$ pnpm pm2

# service crond restart
$ pnpm pm2-restart
```

## Deployment with docker

build docker image from dockerfile
```shell
docker build -t legado-server . 
```

run the container
```shell
docker run -it --rm -p 3333:3333 --name legado-server legado-server
```
