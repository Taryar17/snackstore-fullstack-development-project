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
import { useState, useRef } from "react";

const quantitySchema = z.object({
  quantity: z
    .string()
    .min(1, "Must not be empty")
    .max(3, "Too Many!")
    .regex(/^\d+$/, "Must be a number"),
});

interface EditableProps {
  cartId: number;
  sessionId?: string;
  quantity: number;
  onUpdate: (quantity: number) => void;
  onDelete: () => void;
}

export default function Editable({
  cartId,
  sessionId,
  quantity,
  onUpdate,
  onDelete,
}: EditableProps) {
  const { updateItemOnServer, removeItemFromServer, isLoading } =
    useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add a ref to track if delete is already in progress
  const isDeleteInProgress = useRef(false);

  const form = useForm<z.infer<typeof quantitySchema>>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: quantity.toString(),
    },
  });
  const { setValue, watch } = form;
  const currentQuantity = Number(watch("quantity"));

  const handleDecrease = async () => {
    if (isDeleteInProgress.current) return; // Prevent multiple deletions

    const newQuantity = Math.max(currentQuantity - 1, 1);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
    await handleUpdate(newQuantity);
  };

  const handleIncrease = async () => {
    const newQuantity = Math.min(currentQuantity + 1, 99);
    await handleUpdate(newQuantity);
  };

  const handleUpdate = async (newQuantity: number) => {
    if (!sessionId) {
      toast.error("No active cart session");
      return;
    }

    if (newQuantity === quantity) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateItemOnServer(cartId, newQuantity);

      setValue("quantity", newQuantity.toString(), { shouldValidate: true });

      onUpdate(newQuantity);

      toast.success("Cart updated successfully");
    } catch (error: any) {
      console.error("Failed to update cart:", error);

      toast.error(error.message || "Failed to update cart");
      // Revert to previous value
      setValue("quantity", quantity.toString(), { shouldValidate: true });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!sessionId) {
      toast.error("No active cart session");
      return;
    }

    // Prevent multiple delete calls
    if (isDeleteInProgress.current) {
      return;
    }

    isDeleteInProgress.current = true;
    setIsDeleting(true);

    try {
      await removeItemFromServer(cartId);
      onDelete();
      toast.success("Item removed from cart");
    } catch (error: any) {
      console.error("Failed to remove item:", error);

      // Check if item was already removed
      if (
        error.message.includes("already removed") ||
        error.message.includes("was already removed")
      ) {
        onDelete();
        toast.info("Item was already removed from cart");
      } else if (
        error.message.includes("404") ||
        error.message.includes("not found")
      ) {
        onDelete();
        toast.info("Item removed");
      } else {
        toast.error(error.message || "Failed to remove item");
      }
    } finally {
      setIsDeleting(false);
      isDeleteInProgress.current = false;
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);

    if (!isNaN(numValue) && numValue >= 1 && numValue <= 99) {
      if (numValue !== currentQuantity) {
        await handleUpdate(numValue);
      }
    }
  };

  const handleBlur = () => {
    if (currentQuantity === 0) {
      setValue("quantity", "1", { shouldValidate: true });
    }
  };

  return (
    <Form {...form}>
      <form className="flex w-full gap-4 justify-between">
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-r-none"
            onClick={handleDecrease}
            disabled={
              currentQuantity === 0 || isUpdating || isDeleting || isLoading
            }
          >
            {isUpdating || isDeleting ? (
              <Icons.spinner className="size-3 animate-spin" />
            ) : (
              <Icons.minus className="size-3" aria-hidden="true" />
            )}
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
                    {...field}
                    className="h-8 w-16 rounded-none border-x-8 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                    disabled={isUpdating || isDeleting || isLoading}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = parseInt(value);

                      if (numValue === 0) {
                        setValue("quantity", "1", { shouldValidate: true });
                        return;
                      }

                      field.onChange(value);
                      handleInputChange(e);
                    }}
                    onBlur={handleBlur}
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
              currentQuantity > 99 || isUpdating || isDeleting || isLoading
            }
          >
            {isUpdating ? (
              <Icons.spinner className="size-3 animate-spin" />
            ) : (
              <Icons.plus className="size-3" aria-hidden="true" />
            )}
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          className="size-8"
          size="icon"
          onClick={handleDelete}
          disabled={isUpdating || isDeleting || isLoading}
        >
          {isDeleting ? (
            <Icons.spinner className="size-3 animate-spin" />
          ) : (
            <Icons.trash className="size-3" />
          )}
        </Button>
      </form>
    </Form>
  );
}
