import { useEffect, useState } from "react";
import { stockWebSocket } from "../lib/stockWebSocket";

export const useWebSocketStock = (productId: number) => {
  const [stock, setStock] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleStockUpdate = (newStock: any) => {
      setStock(newStock);
    };

    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
    };

    // Subscribe to stock updates
    const unsubscribe = stockWebSocket.subscribe(productId, handleStockUpdate);
    const unsubscribeConnection = stockWebSocket.onConnectionChange(
      handleConnectionChange
    );

    return () => {
      unsubscribe();
      unsubscribeConnection();
    };
  }, [productId]);

  return {
    stock,
    isConnected,
    hasStockData: !!stock,
  };
};
