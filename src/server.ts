import { createServer } from "node:http";
import { createApp } from "./app.ts";
import { loadConfig } from "./config.ts";

const config = loadConfig();
const app = createApp(config);
const server = createServer((request, response) => {
  app.handler(request, response).catch((error) => {
    console.error(error);
    if (!response.headersSent) response.writeHead(500, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: { code: "INTERNAL_ERROR", message: "Unexpected server error" } }));
  });
});

server.listen(config.port, config.host, () => {
  console.log(`RangeRelay listening on http://${config.host}:${config.port}`);
});

function shutdown() {
  app.store.close();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
