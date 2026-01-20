import apiClient from "@/api/client";
import { authUrls } from "@/api/urls";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import type { NavigateFunction } from "react-router-dom";

// Login
export const loginUser = createAsyncThunk(
  "loginUser",
  async (
    data: {
      email: string;
      password: string;
      navigate: NavigateFunction;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await apiClient.post(authUrls?.login, {
        email: data?.email,
        password: data?.password,
      });

      return {
        body: res.data,
        status: res.status,
        navigate: data?.navigate,
      };
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

//Get User
export const getUser = createAsyncThunk(
  "getUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(authUrls.getUser);

      return { body: res.data, status: res.status };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);
