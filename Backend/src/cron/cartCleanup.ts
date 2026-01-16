import cron from "node-cron";
import { cartService } from "../services/cartService";

export function setupCartCleanupCron() {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      const result = await cartService.cleanupExpiredCarts();
      console.log(`[Cron] Cleaned up ${result.cleaned} expired cart sessions`);
    } catch (error) {
      console.error("[Cron] Error cleaning up carts:", error);
    }
  });

  console.log("Cart cleanup cron job scheduled (every 5 minutes)");
}
