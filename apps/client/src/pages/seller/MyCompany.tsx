import StatusBadge from "@/components/company/StatusBadge";
import { MySelector } from "@/redux/store";

const MyCompany = () => {
  const { company } = MySelector((state) => state.company);

  if (!company) return null;

  const isVerified = company.isVerified;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-secondary-1">My Company</h1>
        <p className="text-sm text-gray mt-1">
          Company information and verification status
        </p>
      </div>

      {/* Company card */}
      <div className="bg-white border rounded-md shadow-sm p-6 space-y-4">
        {/* Name */}
        <div>
          <p className="text-sm text-gray">Company name</p>
          <p className="text-lg font-medium text-secondary-1">{company.name}</p>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray mb-1">Status</p>
          <StatusBadge verified={isVerified} />
        </div>

        {/* Created */}
        <div>
          <p className="text-sm text-gray">Created on</p>
          <p className="text-sm text-secondary-1">
            {new Date(company.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Info message */}
        {!isVerified && (
          <div className="mt-4 rounded-md bg-pending/10 p-4 text-sm text-secondary-1">
            Your company is under admin review. You&apos;ll gain access to
            selling features once it&apos;s verified.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCompany;
