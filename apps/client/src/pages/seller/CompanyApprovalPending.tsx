const CompanyApprovalPending = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-accent/50">
      <div className="max-w-md text-center bg-white p-6 rounded-md border shadow-sm">
        <h1 className="text-xl font-semibold text-secondary-1">
          Company under review
        </h1>
        <p className="text-sm text-gray mt-2">
          Your company has been submitted and is awaiting admin approval. You&apos;ll
          be notified once it&apos;s verified.
        </p>
      </div>
    </div>
  );
};

export default CompanyApprovalPending;
