import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Button } from "../ui/button";

import { Link } from "react-router-dom";
import { cartItems } from "../../data/cart";
import { Badge } from "../ui/badge";
import { Icons } from "../icons";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import CartItem from "../carts/CartItem";
import { formatPrice } from "../../lib/utils";
import { FieldSeparator } from "../ui/field";

function CartSheet() {
  const itemCount = 4;
  const amountTotal = 190;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Badge
            variant="destructive"
            className="absolute -right-2 -top-2 size-6 justify-center rounded-full p-2.5"
          >
            {itemCount}
          </Badge>
          <Icons.cart className="size=4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full md:max-w-lg">
        <SheetHeader className="">
          <SheetTitle>Cart - {itemCount}</SheetTitle>
        </SheetHeader>
        <FieldSeparator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="my-2 h-[80vh] pb-8">
              <div className="flex-1">
                {cartItems.map((cart) => (
                  <CartItem cart={cart} />
                ))}
              </div>
            </ScrollArea>
            <div className="space-y-4">
              <FieldSeparator />
              <div className="space-y-1.5 text-sm m-4">
                <div className="flex justify-between">
                  <span className="">Taxes</span>
                  <span className="">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="">Total</span>
                  <span className="">
                    {formatPrice(amountTotal.toFixed(2))}
                  </span>
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" asChild>
                  <Link to="/checkout">Continue to Checkout</Link>
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <Icons.cart className="size-16 mb-4 text-muted-foreground" />
            <div className="text-xl font-medium text-muted-foreground">
              Your cart is empty
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartSheet;
