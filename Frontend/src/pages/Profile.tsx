import { useState } from "react";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileForm } from "../components/profile/ProfileForm";
import { ProfileOrders } from "../components/profile/ProfileOrders";
import { User } from "../data/user";

function Profile() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-8">
      <ProfileHeader user={User} onEdit={() => setEditing(!editing)} />

      {editing && <ProfileForm user={User} />}

      <ProfileOrders />
    </div>
  );
}

export default Profile;
