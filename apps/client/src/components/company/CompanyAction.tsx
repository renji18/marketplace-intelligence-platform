import Button from "@/ui/Button";
import { useDispatch } from "react-redux";
import { type MyDispatch } from "@/redux/store";
import { toggleCompanyStatus } from "@/redux/slice/company/asyncFn";

const CompanyAction = ({
  companyId,
  isVerified,
}: {
  companyId: string;
  isVerified: boolean;
}) => {
  const dispatch = useDispatch<MyDispatch>();

  return (
    <Button
      text={isVerified ? "Unverify" : "Verify"}
      variant={isVerified ? "secondary" : "primary"}
      size="sm"
      onClick={() => dispatch(toggleCompanyStatus(companyId))}
    />
  );
};

export default CompanyAction;
