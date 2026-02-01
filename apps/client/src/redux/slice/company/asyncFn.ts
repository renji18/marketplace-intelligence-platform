import apiClient from "@/api/client";
import { companyUrls } from "@/api/urls";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import type { NavigateFunction } from "react-router-dom";

// Create Seller company
export const createCompany = createAsyncThunk(
  "createCompany",
  async (
    data: { name: string; navigate: NavigateFunction },
    { rejectWithValue },
  ) => {
    try {
      const res = await apiClient.post(companyUrls.createCompany, {
        name: data.name,
      });

      return { body: res.data, status: res.status, data };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);

// Get Seller company
export const getSellerCompany = createAsyncThunk(
  "getSellerCompany",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(companyUrls.getSellerCompany);

      return { body: res.data, status: res.status };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);

// Get All companies
export const getAllCompanies = createAsyncThunk(
  "getAllCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(companyUrls.getAllCompanies);

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
export const toggleCompanyStatus = createAsyncThunk(
  "toggleCompanyStatus",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(
        companyUrls.toggleCompanyStatus + companyId,
      );

      return { body: res.data, status: res.status, companyId };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);
