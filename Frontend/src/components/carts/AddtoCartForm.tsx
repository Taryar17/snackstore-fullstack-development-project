// AddtoCartForm.tsx - UPDATED with WebSocket
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Icons } from "../icons";
import { useCartStore } from "../../store/cartStore";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productStockQuery } from "../../api/query";
import { useWebSocketStock } from "../../hook/useWebSocketStock";

const quantitySchema = z.object({
  quantity: z
    .string()
    .min(1, "Must not be empty")
    .max(3, "Too Many!")
    .regex(/^\d+$/, "Must be a number"),
});

interface AddtoCartProps {
  canBuy: boolean;
  onHandleCart: (quantity: number) => Promise<void>;
  idInCart: number;
  availableStock: number;
  productName: string;
  productPrice: number;
  productImage: string;
  onStockRefetch?: () => Promise<any>;
  wsConnected?: boolean;
}

export default function AddtoCart({
  canBuy,
  onHandleCart,
  idInCart,
  availableStock: initialAvailableStock,
  productName,
  productPrice,
  productImage,
  onStockRefetch,
  wsConnected = false,
}: AddtoCartProps) {
  const { stock: wsStock, isConnected: isWsConnected } =
    useWebSocketStock(idInCart);

  const {
    data: httpStock,
    isLoading: stockLoading,
    refetch: refetchHttpStock,
  } = useQuery({
    queryKey: ["products", "stock", idInCart],
    queryFn: () => fetchProductStock(idInCart),
    enabled: !isWsConnected,
    staleTime: 30000,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const stockData = wsStock || httpStock;
  const availableStock = stockData?.available || initialAvailableStock;

  const cartItem = useCartStore((state) =>
    state.carts.find((item) => item.id === idInCart)
  );
  const { isLoading, syncCartWithServer } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync cart with server on component mount
  useEffect(() => {
    syncCartWithServer().catch(console.error);
  }, [syncCartWithServer]);

  const form = useForm<z.infer<typeof quantitySchema>>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: cartItem ? cartItem.quantity.toString() : "1",
    },
  });

  const { setValue, watch, handleSubmit } = form;
  const currentQuantity = Number(watch("quantity"));

  useEffect(() => {
    if (cartItem) {
      setValue("quantity", cartItem.quantity.toString(), {
        shouldValidate: true,
      });
    }
  }, [cartItem, setValue]);

  const handleDecrease = () => {
    const newQuantity = Math.max(currentQuantity - 1, 1);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
  };

  const handleIncrease = () => {
    if (currentQuantity >= availableStock) {
      toast.error(`Only ${availableStock} items available`);
      return;
    }
    const newQuantity = Math.min(currentQuantity + 1, 99);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
  };

  const onSubmit = async (values: z.infer<typeof quantitySchema>) => {
    if (!canBuy) {
      toast.error("This product is not available for purchase");
      return;
    }

    const quantity = Number(values.quantity);

    const cartItem = useCartStore
      .getState()
      .carts.find((item) => item.id === idInCart);
    const currentInCart = cartItem?.quantity || 0;

    const totalRequested = currentInCart + quantity;

    // Validate against available stock
    if (totalRequested > availableStock) {
      toast.error(
        `Cannot add ${quantity} more. You already have ${currentInCart} in cart. ` +
          `Total would exceed available stock (${availableStock})`
      );
      return;
    }

    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} items available`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onHandleCart(quantity);
      if (currentInCart > 0) {
        toast.success(`Updated quantity to ${currentInCart + quantity}`);
      } else {
        toast.success("Added to cart");
      }
      if (!isWsConnected && onStockRefetch) {
        setTimeout(() => onStockRefetch(), 500);
      }
    } catch (error: any) {
      // Handle session expired errors
      if (
        error.message.includes("404") ||
        error.message.includes("expired") ||
        error.message.includes("session")
      ) {
        toast.error("Cart session expired. Please refresh the page.");
        // Optionally trigger a refresh
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(error.message || "Failed to update cart");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxQuantity = Math.min(availableStock, 99);
  const showLoading = stockLoading && !isWsConnected;

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-w-65 gap-4 flex-col"
      >
        {/* WebSocket status indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`h-2 w-2 rounded-full ${
                isWsConnected ? "bg-green-500" : "bg-yellow-500"
              }`}
            />
            <span className="text-muted-foreground">
              {isWsConnected ? "Live updates" : "Periodic updates"}
            </span>
          </div>
          {stockData?.timestamp && (
            <span className="text-xs text-muted-foreground">
              {new Date(stockData.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-r-none"
            onClick={handleDecrease}
            disabled={
              currentQuantity <= 1 || isSubmitting || isLoading || showLoading
            }
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
                    max={maxQuantity}
                    {...field}
                    className="h-8 w-16 rounded-none border-x-8 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                    disabled={isSubmitting || isLoading || showLoading}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = parseInt(value);
                      if (
                        !isNaN(numValue) &&
                        numValue >= 1 &&
                        numValue <= maxQuantity
                      ) {
                        field.onChange(value);
                      }
                    }}
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
            disabled={
              currentQuantity >= maxQuantity ||
              isSubmitting ||
              isLoading ||
              showLoading
            }
          >
            <Icons.plus className="size-3" aria-hidden="true" />
          </Button>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            type="submit"
            variant={canBuy && availableStock > 0 ? "default" : "outline"}
            className="w-full font-semibold"
            disabled={
              !canBuy ||
              isSubmitting ||
              isLoading ||
              showLoading ||
              availableStock === 0
            }
          >
            {isSubmitting || isLoading || showLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : cartItem ? (
              "Update Cart"
            ) : availableStock > 0 ? (
              "Add to Cart"
            ) : (
              "Out of Stock"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
