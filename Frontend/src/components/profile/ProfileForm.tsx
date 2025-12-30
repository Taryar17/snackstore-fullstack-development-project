import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { User } from "../../types";

interface UserProps {
  user: User;
}

export function ProfileForm({ user }: UserProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" value={user.firstName} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={user.lastName} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user.email} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={user.phone} />
        </div>

        <Button className="w-full">Save Changes</Button>
      </CardContent>
    </Card>
  );
}
