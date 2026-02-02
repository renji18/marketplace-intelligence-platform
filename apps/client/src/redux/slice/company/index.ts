import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import {
  createCompany,
  getAllCompanies,
  getSellerCompany,
  toggleCompanyStatus,
} from "./asyncFn";
import { toast } from "sonner";

const company = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Create Seller company
    builder
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        const { body, status, data } = action.payload;

        if (status === 201) {
          state.company = {
            name: body.name,
            id: body?.companyId,
            isVerified: false,
            createdAt: new Date(Date.now())?.toISOString(),
          };

          state.message = body?.message;
          toast.success(body?.message);
          data?.navigate("/seller/company-pending");
        }

        state.loading = false;
      })
      .addCase(createCompany.rejected, (state) => {
        state.loading = false;
      });

    // Get Seller company
    builder
      .addCase(getSellerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerCompany.fulfilled, (state, action) => {
        const { body, status } = action.payload;

        if (status === 200) {
          state.company = body?.company;
          state.message = body?.message;
        }

        state.loading = false;
        state.bootstrap = false;
      })
      .addCase(getSellerCompany.rejected, (state) => {
        state.loading = false;
        state.bootstrap = false;
      });

    // Get All companies
    builder
      .addCase(getAllCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCompanies.fulfilled, (state, action) => {
        const { body, status } = action.payload;

        if (status === 200) {
          state.companies = body?.companies;
          state.message = body?.message;
        }

        state.loading = false;
      })
      .addCase(getAllCompanies.rejected, (state) => {
        state.loading = false;
      });

    // Toggle company status
    builder
      .addCase(toggleCompanyStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCompanyStatus.fulfilled, (state, action) => {
        const { body, status, companyId } = action.payload;

        if (status === 200) {
          state.message = body?.message;
          toast.success(body?.message);

          if (state.companies) {
            state.companies = state.companies?.map((c) =>
              c.id === companyId ? { ...c, isVerified: !c.isVerified } : c,
            );
          }
        }

        state.loading = false;
      })
      .addCase(toggleCompanyStatus.rejected, (state) => {
        state.loading = false;
      });
  },
});

// export const {} = company.actions

export default company.reducer;
