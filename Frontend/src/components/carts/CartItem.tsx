import { formatPrice } from "../../lib/utils";
import type { Cart } from "../../types";
import Editable from "./Editable";
import { FieldSeparator } from "../ui/field";

interface CartProps {
  cart: Cart;
}
function CartItem({ cart }: CartProps) {
  return (
    <div className="space-y-3 m-4">
      <div className="flex gap-4 mb-2 mt-4">
        <img
          src={cart.image.url}
          alt="cart image"
          className="object-cover rounded-md w-16"
        />
        <div className="flex flex-col space-y-1">
          <span className="font-medium line-clamp-1 text-sm">{cart.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatPrice(cart.price)} x {cart.quantity} ={" "}
            {formatPrice((cart.price * cart.quantity).toFixed(2))}
          </span>
          <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
            `${cart.category} / ${cart.subcategory}`
          </span>
        </div>
      </div>
      <div className=""></div>
      <Editable />
      <FieldSeparator className="mb-4" />
    </div>
  );
}

export default CartItem;
