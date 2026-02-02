import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import {
  getAllProducts,
  getSellerProducts,
  getSingleProduct,
  upsertProduct,
} from "./asyncFn";
import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";

const company = createSlice({
  name: "company",
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
  },
  extraReducers(builder) {
    // Create Update product
    builder
      .addCase(upsertProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertProduct.fulfilled, (state, action) => {
        const { body, status, navigate } = action.payload;

        if (status === 201) {
          state.message = body?.message;
          toast.success(body?.message);
        }

        state.loading = false;

        navigate("/seller/products");
      })
      .addCase(upsertProduct.rejected, (state, action) => {
        const payload = action.payload as {
          error: string;
          navigate: NavigateFunction;
        };

        if (typeof payload?.error === "string") {
          state.error = payload.error;
          toast.error(payload.error);
        }

        state.loading = false;
        payload.navigate("/seller/products");
      });

    // Get Seller products
    builder
      .addCase(getSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerProducts.fulfilled, (state, action) => {
        const { body, status } = action.payload;

        if (status === 200) {
          state.products = body?.products;
          state.message = body?.message;
        }

        state.loading = false;
      })
      .addCase(getSellerProducts.rejected, (state) => {
        state.loading = false;
      });

    // Get All products
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        const { body, status } = action.payload;

        if (status === 200) {
          state.products = body?.products;
          state.message = body?.message;
        }

        state.loading = false;
      })
      .addCase(getAllProducts.rejected, (state) => {
        state.loading = false;
      });

    // Get single product
    builder
      .addCase(getSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        const { body, status } = action.payload;

        if (status === 200) {
          state.message = body?.message;
          toast.success(body?.message);

          state.product = body?.product;
        }

        state.loading = false;
      })
      .addCase(getSingleProduct.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setProduct } = company.actions;

export default company.reducer;
