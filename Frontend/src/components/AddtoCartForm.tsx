import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Icons } from "./icons";
import { useCartStore } from "../store/cartStore";
import { useEffect } from "react";

const quantitySchema = z.object({
  quantity: z
    .string()
    .min(1, "Must not be empty")
    .max(3, "Too Many!")
    .regex(/^\d+$/, "Must be a number"),
});

interface ShowBuyNowProps {
  canBuy: boolean;
  onHandleCart: (quantity: number) => void;
  idInCart: number;
}

export default function AddtoCart({
  canBuy,
  onHandleCart,
  idInCart,
}: ShowBuyNowProps) {
  const cartItem = useCartStore((state) =>
    state.carts.find((item) => item.id === idInCart)
  );

  const form = useForm<z.infer<typeof quantitySchema>>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: cartItem ? cartItem.quantity.toString() : "1",
    },
  });

  const { setValue, watch } = form;
  const currentQuantity = Number(watch("quantity"));

  useEffect(() => {
    if (cartItem) {
      setValue("quantity", cartItem.quantity.toString(), {
        shouldValidate: true,
      });
    }
  }, [cartItem, setValue]);

  const handleDecrease = () => {
    const newQuantity = Math.max(currentQuantity - 1, 0);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
  };
  const handleIncrease = () => {
    const newQuantity = Math.min(currentQuantity + 1, 99);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
  };
  function onSubmit(values: z.infer<typeof quantitySchema>) {
    onHandleCart(Number(values.quantity));
    toast.success(
      cartItem
        ? "Updated Cart successfully"
        : "Product is added to cart successfully."
    );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-65 gap-4 flex-col"
      >
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-r-none"
            onClick={handleDecrease}
            disabled={currentQuantity <= 1}
          >
            <Icons.minus className="size-3" aria-hidden="true" />
          </Button>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={99}
                    {...field}
                    className="h-8 w-16 rounded-none border-x-8 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-l-none"
            onClick={handleIncrease}
            disabled={currentQuantity >= 99}
          >
            <Icons.plus className="size-3" aria-hidden="true" />
          </Button>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button
            type="submit"
            variant={canBuy ? "outline" : "default"}
            className="w-full font-semibold"
          >
            {cartItem ? "Update Cart" : "Add to Cart"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
