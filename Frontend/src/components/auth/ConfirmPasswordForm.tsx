// pages/auth/ConfirmPassword.tsx
import { Form, useActionData, useNavigation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../../components/ui/field";
import { Link } from "react-router-dom";
import { Icons } from "../../components/icons";
import useAuthStore from "../../store/authStore";

function ConfirmPasswordPage() {
  const actionData = useActionData() as { error?: string } | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const authStore = useAuthStore();

  return (
    <div className="flex min-h-screen place-items-center justify-center items-center px-4">
      <Link
        to="/"
        className="text-foreground/80 hover:text-foreground fixed top-6 left-8 flex items-center text-lg font-bold tracking-tight transition-colors"
      >
        <Icons.logo className="mr-2 size-6" aria-hidden="true" />
        <span>Snack Break</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Complete Registration</CardTitle>
          <CardDescription>
            Step 3: Set your password and personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <FieldGroup className="space-y-4">
              {/* Password Fields */}
              <div>
                <FieldLabel htmlFor="password">Password (8 digits)</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  pattern="[0-9]{8}"
                  inputMode="numeric"
                  maxLength={8}
                  required
                />
                <FieldDescription>
                  Enter 8 digits for your password
                </FieldDescription>
              </div>

              <div>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  pattern="[0-9]{8}"
                  inputMode="numeric"
                  maxLength={8}
                  required
                />
              </div>

              {/* Personal Information */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">
                  Personal Information (Required)
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                    />
                  </Field>
                </div>

                <Field className="mb-4">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                  />
                </Field>

                {/* Address Information */}
                <Field className="mb-4">
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Street address, apartment, suite, etc."
                    required
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="city">City/Town</FieldLabel>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Yangon"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="region">Region/State</FieldLabel>
                    <Input
                      id="region"
                      name="region"
                      type="text"
                      placeholder="Yangon Region"
                      required
                    />
                  </Field>
                </div>
              </div>

              {actionData?.error && (
                <div className="text-sm text-red-500 text-center">
                  {actionData.error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>

              <FieldDescription className="text-center">
                Registering phone: 09{authStore.phone}
              </FieldDescription>
            </FieldGroup>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConfirmPasswordPage;
