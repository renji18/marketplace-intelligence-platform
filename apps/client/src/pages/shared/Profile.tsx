import ProfileField from "@/components/profile/ProfileField";
import { MySelector } from "@/redux/store";
import Button from "@/ui/Button";

const Profile = () => {
  const { user } = MySelector((state) => state.auth);

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-secondary-1">Profile</h1>
        <p className="text-sm text-gray mt-1">Your personal information</p>
      </div>

      {/* Profile card */}
      <div className="bg-white border rounded-md shadow-sm p-6 space-y-5">
        {/* Name */}
        <ProfileField label="Full name">
          {user.firstName} {user.lastName}
        </ProfileField>

        {/* Email */}
        <ProfileField label="Email address">{user.email}</ProfileField>

        {/* Role */}
        <ProfileField label="Role">
          <span className="capitalize">{user.role.toLowerCase()}</span>
        </ProfileField>

        {/* Joined */}
        <ProfileField label="Joined on">
          {new Date(user?.createdAt).toLocaleDateString()}
        </ProfileField>

        {/* Actions */}
        <div className="pt-4 border-t">
          <Button
            text="Edit profile"
            variant="secondary"
            size="sm"
            onClick={() => {
              /* open edit later */
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
