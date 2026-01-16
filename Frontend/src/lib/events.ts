// Frontend/lib/events.ts
type CartEvent = "cart-updated";

const cartEvent = new EventTarget();

export const emitCartEvent = () => {
  console.log("Emitting cart updated event");
  cartEvent.dispatchEvent(new Event("cart-updated"));
};

export const subscribeToCartEvents = (callback: () => void) => {
  cartEvent.addEventListener("cart-updated", callback);
  return () => cartEvent.removeEventListener("cart-updated", callback);
};
