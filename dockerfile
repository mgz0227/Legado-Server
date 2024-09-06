FROM node:22.8.0-alpine3.20
COPY . /root
WORKDIR /root
RUN npm config set registry=https://registry.npmmirror.com && npm install -g pnpm && pnpm install
RUN pnpm build
CMD [ "pnpm", "start:prod" ]
EXPOSE 3333