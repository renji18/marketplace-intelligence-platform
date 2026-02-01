const StatusBadge = ({ verified }: { verified: boolean }) => {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        ${
          verified ? "bg-success/10 text-success" : "bg-pending/10 text-pending"
        }
      `}
    >
      {verified ? "Verified" : "Pending"}
    </span>
  );
};

export default StatusBadge;
