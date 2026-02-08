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

// Verify OTP
export const verifyOtp = createAsyncThunk(
  "verifyOtp",
  async (
    data: {
      otp: string;
      navigate: NavigateFunction;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await apiClient.post(authUrls?.verifyOtp, {
        otp: data?.otp,
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

// Get User
export const getUser = createAsyncThunk(
  "getUser",
  async (navigate: NavigateFunction, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(authUrls.getUser);

      return { body: res.data, status: res.status, navigate };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);

// Send forgot password email
export const sendForgotPasswordEmail = createAsyncThunk(
  "sendForgotPasswordEmail",
  async (
    data: { email: string; navigate: NavigateFunction },
    { rejectWithValue },
  ) => {
    try {
      const res = await apiClient.post(authUrls.forgotpassword, {
        email: data.email,
      });

      return { body: res.data, status: res.status, navigate: data.navigate };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);

// Verify and reset
export const verifyAndReset = createAsyncThunk(
  "verifyAndReset",
  async (
    data: {
      email: string;
      oldPassword: string;
      newPassword: string;
      navigate: NavigateFunction;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await apiClient.post(authUrls.verifyAndReset, {
        email: data.email,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      return { body: res.data, status: res.status, navigate: data.navigate };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);

// Log out User
export const logOut = createAsyncThunk(
  "logOut",
  async (navigate: NavigateFunction, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(authUrls.logout);

      return { body: res.data, status: res.status, navigate };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        return rejectWithValue(error?.response?.data["error"]);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  },
);
