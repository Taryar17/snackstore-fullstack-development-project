import { formatPrice } from "../../lib/utils";
import type { Cart } from "../../types";
import Editable from "./Editable";
import { FieldSeparator } from "../ui/field";
import { useCartStore } from "../../store/cartStore";
import { toast } from "sonner";

interface CartProps {
  cart: Cart;
}

const imageURL = import.meta.env.VITE_IMG_URL;

function CartItem({ cart }: CartProps) {
  const {
    updateItemOnServer,
    removeItemFromServer,
    sessionId,
    syncCartWithServer,
  } = useCartStore();

  const updateHandler = async (quantity: number) => {
    if (!sessionId) {
      toast.error("No active cart session");
      return;
    }

    try {
      await updateItemOnServer(cart.id, quantity);
    } catch (error: any) {
      console.error("Failed to update cart item:", error);

      // Handle session expired errors
      if (
        error.message.includes("404") ||
        error.message.includes("expired") ||
        error.message.includes("session")
      ) {
        toast.error("Cart session expired. Syncing with server...");
        await syncCartWithServer();
      } else {
        toast.error(error.message || "Failed to update cart");
      }
    }
  };

  const deleteHandler = async () => {
    try {
      await removeItemFromServer(cart.id);
    } catch (error: any) {
      console.error("Failed to remove cart item:", error);

      // Handle session expired errors
      if (
        error.message.includes("404") ||
        error.message.includes("expired") ||
        error.message.includes("session")
      ) {
        toast.error("Cart session expired. Syncing with server...");
        await syncCartWithServer();
      } else {
        toast.error(error.message || "Failed to remove item");
      }
    }
  };

  return (
    <div className="space-y-3 m-4">
      <div className="flex gap-4 mb-2 mt-4">
        <img
          src={imageURL + cart.image}
          loading="lazy"
          decoding="async"
          alt="cart image"
          className="object-cover rounded-md w-16"
        />
        <div className="flex flex-col space-y-1">
          <span className="font-medium line-clamp-1 text-sm">{cart.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatPrice(cart.price)} x {cart.quantity} ={" "}
            {formatPrice((cart.price * cart.quantity).toFixed(2))}
          </span>
        </div>
      </div>
      <div className=""></div>
      <Editable
        cartId={cart.id}
        sessionId={sessionId}
        onDelete={deleteHandler}
        quantity={cart.quantity}
        onUpdate={updateHandler}
      />
      <FieldSeparator className="mb-4" />
    </div>
  );
}

export default CartItem;
