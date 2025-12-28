import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { cn } from "../lib/utils";

const quantitySchema = z.object({
  quantity: z.number().min(0),
});

interface ShowBuyNowProps {
  canBuy: boolean;
}

export default function AddtoCart({ canBuy }: ShowBuyNowProps) {
  const form = useForm<z.infer<typeof quantitySchema>>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: 1,
    },
  });

  function onSubmit(values: z.infer<typeof quantitySchema>) {
    console.log(values);
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
                    className="h-8 w-16 rounded-none border-x-8"
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
          >
            <Icons.plus className="size-3" aria-hidden="true" />
          </Button>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button
            type="button"
            className={cn(
              "w-full bg-amber-600 font-bold hover:bg-amber-700",
              !canBuy && "bg-slate-400"
            )}
            size="sm"
            disabled
          >
            Buy Now
          </Button>
          <Button
            type="submit"
            variant={canBuy ? "outline" : "default"}
            className="w-full font-semibold"
          >
            Add to Cart
          </Button>
        </div>
      </form>
    </Form>
  );
}
