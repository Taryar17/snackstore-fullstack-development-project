import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const quantitySchema = z.object({
  quantity: z
    .string()
    .min(1, "Must not be empty")
    .max(3, "Too Many!")
    .regex(/^\d+$/, "Must be a number"),
});

interface EditableProps {
  quantity: number;
  onUpdate: (quantity: number) => void;
  onDelete: () => void;
}

export default function Editable({
  quantity,
  onUpdate,
  onDelete,
}: EditableProps) {
  const form = useForm<z.infer<typeof quantitySchema>>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: quantity.toString(),
    },
  });
  const { setValue, watch } = form;
  const currentQuantity = Number(watch("quantity"));

  const handleDecrease = () => {
    const newQuantity = Math.max(currentQuantity - 1, 0);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
    onUpdate(newQuantity);
  };
  const handleIncrease = () => {
    const newQuantity = Math.min(currentQuantity + 1, 99);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
    onUpdate(newQuantity);
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
            disabled={currentQuantity === 0}
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
                    min={0}
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
            disabled={currentQuantity > 99}
          >
            <Icons.plus className="size-3" aria-hidden="true" />
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          className="size-8"
          size="icon"
          onClick={onDelete}
        >
          <Icons.trash className="size-3" />
        </Button>
      </form>
    </Form>
  );
}
