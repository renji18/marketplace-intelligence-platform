import apiClient from "@/api/client";
import { cartUrls } from "@/api/urls";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

// Create/Update Product
export const addToCart = createAsyncThunk(
  "addToCart",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(cartUrls.addToCart + productId);

      return { body: res.data, status: res.status };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);

// Get Seller products
export const removeFromCart = createAsyncThunk(
  "removeFromCart",
  async (
    data: { productId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await apiClient.get(
        cartUrls.removeFromCart + data.productId + "/" + data.quantity,
      );

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
export const getMyCart = createAsyncThunk(
  "getMyCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(cartUrls.getMyCart);

      return { body: res.data, status: res.status };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);
