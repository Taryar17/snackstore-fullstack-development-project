// components/auth/RegisterForm.tsx
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { FieldDescription, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

const step1Schema = z
  .object({
    phone: z
      .string()
      .regex(
        /^09\d{7,9}$/,
        "Phone number must start with 09 and be 9-11 digits"
      ),
    password: z.string().regex(/^\d{8}$/, "Password must be 8 digits"),
    confirmPassword: z
      .string()
      .regex(/^\d{8}$/, "Confirm password must be 8 digits"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof step1Schema>) => {
    // This will be handled by the router action
    const formData = new FormData();
    formData.append("phone", data.phone);
    formData.append("password", data.password);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>
            Step 1: Enter your phone number and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form method="post" action="/register" className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="phone"
                        type="tel"
                        placeholder="09123456789"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        placeholder="8 digits"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        placeholder="8 digits"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Send OTP
              </Button>

              <FieldDescription className="text-center">
                Already have an account? <Link to="/login">Login</Link>
              </FieldDescription>
            </form>
          </Form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By creating an account, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
