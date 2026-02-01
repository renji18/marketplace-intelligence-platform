const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-2xl font-bold text-secondary-1">Access denied</h1>
        <p className="text-gray mt-2">
          You don&apos;t have permission to view this page.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
