import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import type { User } from "../../types";

interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
}

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  const initials =
    `${user.firstName?.charAt(0) ?? ""}${
      user.lastName?.charAt(0) ?? ""
    }`.trim() ||
    user.phone?.slice(-2) ||
    "U";

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : `09${user.phone}`;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
        {user.image ? (
          <AvatarImage
            src={user.image}
            alt={displayName}
            className="object-cover"
          />
        ) : null}
        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-orange-100 to-amber-100">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-3 text-center sm:text-left">
        <div>
          <h2 className="text-2xl font-bold text-[#3b5d50]">{displayName}</h2>
          {user.email && <p className="text-muted-foreground">{user.email}</p>}
          <p className="text-sm text-muted-foreground mt-1">
            Member since {memberSince}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="rounded-full"
          >
            Edit Profile
          </Button>
          {(user.address || user.city) && (
            <div className="text-sm text-muted-foreground">
              {user.address && <p>{user.address}</p>}
              {user.city && user.region && (
                <p>
                  {user.city}, {user.region}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
