// src/index.ts - Modified to include WebSocket
import "dotenv/config";
import { createServer } from "http";
import { app } from "./app";
import { wsSocketServer } from "./websocket/wsStockServer";

const APP_PORT = process.env.APP_PORT || 4000;

const server = createServer(app);

export const stockWSS = new wsSocketServer(server);

server.listen(APP_PORT, () => {
  console.log(`HTTP + WebSocket server running on port ${APP_PORT}`);
});
