import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllCompanies } from "@/redux/slice/company/asyncFn";
import { MySelector, type MyDispatch } from "@/redux/store";
import StatusBadge from "@/components/company/StatusBadge";
import CompanyAction from "@/components/company/CompanyAction";

const AllCompanies = () => {
  const dispatch = useDispatch<MyDispatch>();
  const { companies, loading } = MySelector((state) => state.company);

  useEffect(() => {
    if (!companies) dispatch(getAllCompanies());
  }, [dispatch, companies]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-secondary-1">Companies</h1>
        <p className="text-sm text-gray">Review and manage seller companies</p>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-md shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-accent text-secondary-1">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Company</th>
              <th className="px-4 py-3 text-left font-medium">Owner</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray">
                  Loading companies…
                </td>
              </tr>
            )}

            {!loading && companies?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray">
                  No companies found
                </td>
              </tr>
            )}

            {companies?.map((company) => (
              <tr key={company.id}>
                <td className="px-4 py-3 font-medium">{company.name}</td>

                <td className="px-4 py-3">
                  {company.owner ? (
                    <div>
                      <p>
                        {company.owner.user.firstName}{" "}
                        {company.owner.user.lastName}
                      </p>
                      <p className="text-xs text-gray">
                        {company.owner.user.email}
                      </p>
                    </div>
                  ) : (
                    <span className="text-gray">—</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge verified={company.isVerified} />
                </td>

                <td className="px-4 py-3 text-gray">
                  {new Date(company.createdAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-right">
                  <CompanyAction
                    companyId={company.id}
                    isVerified={company.isVerified}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllCompanies;
