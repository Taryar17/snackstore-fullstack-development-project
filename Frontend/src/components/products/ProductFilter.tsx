import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import type { Category } from "../../types";

interface FilterProps {
  filterList: { categories: Category[]; types: Category[] };
}

const FormSchema = z.object({
  categories: z.array(z.string()),
  // .refine((value) => value.some((item) => item), {
  //   message: "You have to select at least one categories.",
  // }),
  types: z.array(z.string()),
  // .refine((value) => value.some((item) => item), {
  //   message: "You have to select at least one types.",
  // }),
});

export default function ProductFilter({ filterList }: FilterProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories: [],
      types: [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Submit data .....", data);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base mb-4 block">
                Snack Categories
              </FormLabel>

              {filterList.categories.map((item) => (
                <FormItem
                  key={item.id}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(item.id.toString())}
                      onCheckedChange={(checked) => {
                        const value = item.id.toString();
                        field.onChange(
                          checked
                            ? [...(field.value ?? []), value]
                            : field.value?.filter((v) => v !== value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="types"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base mb-4 block">
                Snack Types
              </FormLabel>

              {filterList.types.map((item) => (
                <FormItem
                  key={item.id}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(item.id.toString())}
                      onCheckedChange={(checked) => {
                        const value = item.id.toString();
                        field.onChange(
                          checked
                            ? [...(field.value ?? []), value]
                            : field.value?.filter((v) => v !== value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>
    </Form>
  );
}
