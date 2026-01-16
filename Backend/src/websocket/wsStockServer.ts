// backend/src/websocket/stockServer.ts
import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { prisma } from "../services/prismaClient";

interface StockMessage {
  type: "get-stock" | "subscribe" | "unsubscribe";
  productId: number;
}

export class wsSocketServer {
  private wss: WebSocketServer;
  private subscriptions: Map<number, Set<WebSocket>> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({
      server,
      path: "/stock",
      perMessageDeflate: false,
    });

    this.setupConnectionHandlers();
    console.log("WebSocket server initialized on path /stock");
  }

  private setupConnectionHandlers() {
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("Stock WebSocket client connected");

      ws.on("message", async (data: Buffer) => {
        try {
          const message: StockMessage = JSON.parse(data.toString());
          await this.handleMessage(ws, message);
        } catch (error) {
          console.error("WebSocket message error:", error);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid message format",
              })
            );
          }
        }
      });

      ws.on("close", () => {
        console.log("Stock WebSocket client disconnected");
        this.removeClient(ws);
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        this.removeClient(ws);
      });

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "connected",
            message: "Connected to stock WebSocket server",
          })
        );
      }
    });

    this.wss.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });

    this.wss.on("listening", () => {
      console.log("WebSocket server is listening for connections");
    });
  }

  private async handleMessage(ws: WebSocket, message: StockMessage) {
    switch (message.type) {
      case "get-stock":
        await this.sendStock(ws, message.productId);
        break;
      case "subscribe":
        this.subscribe(ws, message.productId);
        await this.sendStock(ws, message.productId);
        break;
      case "unsubscribe":
        this.unsubscribe(ws, message.productId);
        break;
      default:
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: `Unknown message type: ${(message as any).type}`,
            })
          );
        }
    }
  }

  private subscribe(ws: WebSocket, productId: number) {
    if (!this.subscriptions.has(productId)) {
      this.subscriptions.set(productId, new Set());
    }
    this.subscriptions.get(productId)!.add(ws);
    console.log(`Client subscribed to product ${productId}`);
  }

  private unsubscribe(ws: WebSocket, productId: number) {
    const sockets = this.subscriptions.get(productId);
    if (sockets) {
      sockets.delete(ws);
      if (sockets.size === 0) {
        this.subscriptions.delete(productId);
      }
      console.log(`Client unsubscribed from product ${productId}`);
    }
  }

  private removeClient(ws: WebSocket) {
    for (const [productId, sockets] of this.subscriptions.entries()) {
      sockets.delete(ws);
      if (sockets.size === 0) {
        this.subscriptions.delete(productId);
      }
    }
    console.log("Client removed from all subscriptions");
  }

  private async sendStock(ws: WebSocket, productId: number) {
    try {
      const stock = await this.getProductStock(productId);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "stock-update",
            productId,
            stock,
            timestamp: new Date().toISOString(),
          })
        );
      }
    } catch (error) {
      console.error("Error getting stock:", error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "error",
            productId,
            message: "Failed to fetch stock",
          })
        );
      }
    }
  }

  private async getProductStock(productId: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          inventory: true,
          reserved: true,
          status: true,
        },
      });

      if (!product) {
        return null;
      }

      const available = Math.max(0, product.inventory - product.reserved);

      return {
        id: product.id,
        inventory: product.inventory,
        reserved: product.reserved,
        available,
        status: product.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error fetching stock for product ${productId}:`, error);
      throw error;
    }
  }

  // Call this method when stock changes (e.g., after cart operations)
  public async broadcastStockUpdate(productId: number) {
    console.log(`Broadcasting stock update for product ${productId}`);
    const sockets = this.subscriptions.get(productId);
    if (!sockets) {
      console.log(`No subscribers for product ${productId}`);
      return;
    }

    try {
      const stock = await this.getProductStock(productId);
      if (!stock) {
        console.log(`Product ${productId} not found for broadcast`);
        return;
      }

      const message = JSON.stringify({
        type: "stock-update",
        productId,
        stock,
        timestamp: new Date().toISOString(),
      });

      const closedSockets: WebSocket[] = [];
      let sentCount = 0;

      sockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
          sentCount++;
        } else {
          closedSockets.push(ws);
        }
      });

      // Clean up closed sockets
      closedSockets.forEach((ws) => {
        sockets.delete(ws);
      });

      console.log(
        `Broadcast sent to ${sentCount} clients for product ${productId}`
      );
      if (closedSockets.length > 0) {
        console.log(`Cleaned up ${closedSockets.length} dead connections`);
      }
    } catch (error) {
      console.error(
        `Error broadcasting stock update for product ${productId}:`,
        error
      );
    }
  }

  // Get stats for debugging
  public getStats() {
    const stats: any = {
      totalConnections: this.wss.clients.size,
      subscribedProducts: this.subscriptions.size,
      subscriptions: {},
    };

    for (const [productId, sockets] of this.subscriptions.entries()) {
      stats.subscriptions[productId] = {
        subscriberCount: sockets.size,
        connections: Array.from(sockets).map((ws) => ({
          readyState: ws.readyState,
        })),
      };
    }

    return stats;
  }
}
