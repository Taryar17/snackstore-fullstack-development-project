import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import type { User } from "../../types";

interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
}

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  const initials = `${user.firstName?.charAt(0) ?? ""}${
    user.lastName?.charAt(0) ?? ""
  }`;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <Avatar className="h-28 w-28 border">
        <AvatarImage src={user.imageUrl} alt="Profile Image" />
        <AvatarFallback className="text-2xl font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2 text-center sm:text-left">
        <h2 className="text-2xl font-bold">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-muted-foreground">{user.email}</p>

        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
