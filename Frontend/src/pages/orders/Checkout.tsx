// pages/checkout/CheckoutPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Icons } from "../../components/icons";
import { formatPrice } from "../../lib/utils";
import { useCartStore } from "../../store/cartStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../api";
import { useToast } from "../../hook/use-toast";

const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function CheckoutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { carts, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user info to pre-fill form
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["checkout-info"],
    queryFn: () => api.get("/users/checkout-info").then((res) => res.data.user),
  });

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    }
  }, [userData, form]);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await api.post("/users/orders", orderData);
      return response.data;
    },
    onSuccess: (data) => {
      clearCart();
      setIsSubmitting(false);
      const { syncCartWithServer } = useCartStore.getState();
      syncCartWithServer();

      toast({
        title: "Order Placed Successfully!",
        description: (
          <div className="space-y-2">
            <p>Order #{data.orderCode} has been placed.</p>
            <p className="text-sm text-muted-foreground">
              {data.estimatedDeliveryDate
                ? `Estimated delivery: ${new Date(
                    data.estimatedDeliveryDate
                  ).toLocaleDateString()}`
                : "Delivery date will be confirmed by admin soon."}
            </p>
            <p className="text-sm">
              You will receive confirmation on your phone.
            </p>
          </div>
        ),
      });

      // Navigate to home page after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (error: any) => {
      console.error("Order creation failed:", error);
      setIsSubmitting(false);
      toast({
        title: "Order Failed",
        description: error.response?.data?.message || "Failed to place order",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    const { sessionId } = useCartStore.getState();
    // Prepare order items from cart
    const orderItems = carts.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    // Prepare order payload
    const orderPayload = {
      items: orderItems,
      totalPrice: getTotalPrice(),
      cartSessionId: sessionId,
    };

    createOrderMutation.mutate(orderPayload);
  };

  const totalAmount = getTotalPrice();

  if (carts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-[#3b5d50]">
          Your cart is empty
        </h1>
        <p className="mb-8 text-muted-foreground">
          Add some items to your cart before checkout
        </p>
        <Button
          onClick={() => navigate("/products")}
          className="rounded-full bg-orange-300 px-8 py-6"
        >
          Browse Products
        </Button>
      </div>
    );
  }

  if (isLoadingUser) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-4">Loading your information...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-[#3b5d50]">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/*User Info Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Confirm Your Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Please review and confirm your details before placing the order
              </p>
            </CardHeader>
            <CardContent>
              <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Icons.truck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="space-y-1">
                      <h3 className="font-medium text-blue-800">
                        Delivery Information
                      </h3>
                      <p className="text-sm text-blue-700">
                        Your delivery date will be confirmed by our team within
                        24 hours. We'll notify you via SMS once confirmed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-orange-300 py-6 text-base font-bold hover:bg-orange-400"
                    >
                      {isSubmitting ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        `Confirm Order - ${formatPrice(totalAmount)}`
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/*Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Cart Items */}
                <div className="max-h-80 overflow-y-auto space-y-4">
                  {carts.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={`${import.meta.env.VITE_IMG_URL}${item.image}`}
                          alt={item.name}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                        <Badge className="absolute -top-2 -right-2 bg-orange-300">
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#3b5d50]">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 text-center text-sm text-muted-foreground">
                  <p>You will receive order confirmation on your phone.</p>
                  <p className="mt-1">Payment: Cash on Delivery</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to cart button */}
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full mt-4"
          >
            <Icons.arrowleft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
