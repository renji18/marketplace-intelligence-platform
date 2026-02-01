const ProfileField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <p className="text-sm text-gray">{label}</p>
      <p className="text-sm font-medium text-secondary-1 mt-0.5">{children}</p>
    </div>
  );
};

export default ProfileField;
