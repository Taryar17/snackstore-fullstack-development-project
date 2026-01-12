import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { User } from "../../types";
import { updateProfileMutation } from "../../api/query";
import { useToast } from "../../hook/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ProfileForm({ user, onCancel, onSuccess }: ProfileFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      address: user.address || "",
      city: user.city || "",
      region: user.region || "",
    },
  });

  const updateMutation = useMutation({
    ...updateProfileMutation(),
    onSuccess: (data) => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      // Invalidate user profile query
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      // Invalidate user query in header
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    // Remove empty strings and send null for empty values
    const formattedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value?.trim() === "" ? null : value?.trim(),
      ])
    );

    updateMutation.mutate(formattedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="firstName">First Name</Label>
                    <FormControl>
                      <Input id="firstName" placeholder="John" {...field} />
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
                    <Label htmlFor="lastName">Last Name</Label>
                    <FormControl>
                      <Input id="lastName" placeholder="Doe" {...field} />
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
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="address">Address</Label>
                  <FormControl>
                    <Input
                      id="address"
                      placeholder="Street address, apartment, suite, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="city">City</Label>
                    <FormControl>
                      <Input id="city" placeholder="Yangon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="region">Region/State</Label>
                    <FormControl>
                      <Input
                        id="region"
                        placeholder="Yangon Region"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={`09${user.phone}`}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Phone number cannot be changed
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-orange-300 hover:bg-orange-400"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
