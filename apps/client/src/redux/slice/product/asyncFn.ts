import apiClient from "@/api/client";
import { productUrls } from "@/api/urls";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import type { NavigateFunction } from "react-router-dom";

// Create/Update Product
export const upsertProduct = createAsyncThunk(
  "upsertProduct",
  async (
    data: {
      product: {
        id?: string;
        name: string;
        description?: string;
        quantity: number;
        price: number;
        priceReason?: string;
        image?: number;
        category: string;
        removeProductImageIds?: string[];
      };
      navigate: NavigateFunction;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await apiClient.post(productUrls.upsertProduct, data.product);

      return { body: res.data, status: res.status, navigate: data?.navigate };
    } catch (error) {
      let message = "An unexpected error occurred.";
      if (error instanceof AxiosError && error?.response) {
        message = error?.response?.data["error"];
      }

      return rejectWithValue({
        error: message,
        navigate: data?.navigate,
      });
    }
  },
);

// Get Seller products
export const getSellerProducts = createAsyncThunk(
  "getSellerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(productUrls.getSellerProducts);

      return { body: res.data, status: res.status };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);

// Get All products
export const getAllProducts = createAsyncThunk(
  "getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(productUrls.getAllProducts);

      return { body: res.data, status: res.status };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);

// Get single product
export const getSingleProduct = createAsyncThunk(
  "getSingleProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(productUrls.getSingleProduct + id);

      return { body: res.data, status: res.status };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);

// Toggle company status
// export const toggleCompanyStatus = createAsyncThunk(
//   "toggleCompanyStatus",
//   async (companyId: string, { rejectWithValue }) => {
//     try {
//       const res = await apiClient.get(
//         companyUrls.toggleCompanyStatus + companyId,
//       );

//       return { body: res.data, status: res.status, companyId };
//     } catch (error) {
//       if (error instanceof AxiosError && error?.response) {
//         return rejectWithValue(error?.response?.data["error"]);
//       }
//       return rejectWithValue("An unexpected error occurred.");
//     }
//   },
// );
