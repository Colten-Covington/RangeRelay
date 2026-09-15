FROM node:24-alpine
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY config ./config
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8787
USER node
EXPOSE 8787
CMD ["node", "--experimental-strip-types", "src/server.ts"]
