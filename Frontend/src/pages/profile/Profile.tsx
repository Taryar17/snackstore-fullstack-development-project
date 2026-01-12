import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileForm } from "../../components/profile/ProfileForm";
import { ProfileOrders } from "../../components/profile/ProfileOrders";
import { userProfileQuery } from "../../api/query";
import { Skeleton } from "../../components/ui/skeleton";

function Profile() {
  const [editing, setEditing] = useState(false);
  const { data: user, isLoading } = useSuspenseQuery(userProfileQuery());

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-10 space-y-8">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-8">
      <ProfileHeader user={user} onEdit={() => setEditing(!editing)} />

      {editing && (
        <ProfileForm
          user={user}
          onCancel={() => setEditing(false)}
          onSuccess={() => setEditing(false)}
        />
      )}

      <ProfileOrders />
    </div>
  );
}

export default Profile;
