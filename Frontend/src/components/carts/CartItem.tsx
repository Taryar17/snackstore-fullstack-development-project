import { formatPrice } from "../../lib/utils";
import type { Cart } from "../../types";
import Editable from "./Editable";
import { FieldSeparator } from "../ui/field";
import { useCartStore } from "../../store/cartStore";

interface CartProps {
  cart: Cart;
}

const imageURL = import.meta.env.VITE_IMG_URL;

function CartItem({ cart }: CartProps) {
  const { updateItem, removeItem } = useCartStore();
  const updateHandler = (quantity: number) => {
    updateItem(cart.id, quantity);
  };

  const deleteHandler = () => {
    removeItem(cart.id);
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
        onDelete={deleteHandler}
        quantity={cart.quantity}
        onUpdate={updateHandler}
      />
      <FieldSeparator className="mb-4" />
    </div>
  );
}

export default CartItem;
