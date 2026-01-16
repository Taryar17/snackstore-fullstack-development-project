class StockWebSocket {
  private socket: WebSocket | null = null;
  private subscribers: Map<number, Array<(stock: any) => void>> = new Map();
  private connectionCallbacks: Array<(connected: boolean) => void> = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname;
    const port = "8080";
    const wsUrl = `${protocol}//${host}:${port}/stock`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log("Stock WebSocket connected");
        this.reconnectAttempts = 0;
        this.notifyConnectionChange(true);

        // Resubscribe to all products
        this.resubscribeAll();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "stock-update" && data.productId && data.stock) {
            this.notifySubscribers(data.productId, data.stock);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.socket.onclose = () => {
        console.log("Stock WebSocket disconnected");
        this.notifyConnectionChange(false);
        this.scheduleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error("Stock WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.scheduleReconnect();
    }
  }

  subscribe(productId: number, callback: (stock: any) => void) {
    if (!this.subscribers.has(productId)) {
      this.subscribers.set(productId, []);
    }

    const callbacks = this.subscribers.get(productId)!;
    if (!callbacks.includes(callback)) {
      callbacks.push(callback);
    }

    // Request stock if connected
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.requestStock(productId);
    }

    return () => this.unsubscribe(productId, callback);
  }

  unsubscribe(productId: number, callback: (stock: any) => void) {
    const callbacks = this.subscribers.get(productId);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.subscribers.delete(productId);
      }
    }
  }

  onConnectionChange(callback: (connected: boolean) => void) {
    this.connectionCallbacks.push(callback);
    return () => {
      const index = this.connectionCallbacks.indexOf(callback);
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1);
      }
    };
  }

  private notifySubscribers(productId: number, stock: any) {
    const callbacks = this.subscribers.get(productId);
    if (callbacks) {
      // Use setTimeout to avoid blocking
      setTimeout(() => {
        callbacks.forEach((callback) => {
          try {
            callback(stock);
          } catch (error) {
            console.error("Error in stock callback:", error);
          }
        });
      }, 0);
    }
  }

  private notifyConnectionChange(connected: boolean) {
    this.connectionCallbacks.forEach((callback) => {
      try {
        callback(connected);
      } catch (error) {
        console.error("Error in connection callback:", error);
      }
    });
  }

  private requestStock(productId: number) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "get-stock",
          productId,
        })
      );
    }
  }

  private resubscribeAll() {
    for (const [productId] of this.subscribers) {
      this.requestStock(productId);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

      this.reconnectTimeout = setTimeout(() => {
        console.log(`Reconnecting attempt ${this.reconnectAttempts}`);
        this.connect();
      }, delay);
    } else {
      console.log("Max reconnection attempts reached");
    }
  }

  get isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const stockWebSocket = new StockWebSocket();
