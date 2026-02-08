import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import {
  getUser,
  loginUser,
  logOut,
  sendForgotPasswordEmail,
  verifyAndReset,
  verifyOtp,
} from "./asyncFn";
import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";
import { ADMIN, BUYER, SELLER } from "@/utils/assets";

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    //Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const { body, status, navigate } = action.payload;

        if (status === 200) {
          toast.success(body?.message);
          state.message = body?.message;
          state.error = null;
          navigate("/verify-otp");
        } else if (status === 201) {
          toast.success(body?.message);
          state.message = body?.message;
          state.error = null;
          navigate("/forgot-password/check-email");
        } else {
          toast.error("Login Error");
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        const payload = action.payload as {
          error: string;
          navigate: NavigateFunction;
        };

        if (typeof payload?.error === "string") {
          state.error = payload.error;
          toast.error(payload.error);
        }

        state.loading = false;
      });

    //Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        const { body, status, navigate } = action.payload;

        if (status === 200) {
          toast.success(body?.message);

          state.message = body?.message;
          state.error = null;

          const role = body?.roleName;

          if (role === ADMIN) {
            navigate("/admin/dashboard");
          } else if (role === BUYER) {
            navigate("/buyer/dashboard");
          } else if (role === SELLER) {
            navigate("/seller/dashboard");
          }
        } else {
          navigate("/login");
          toast.error("Login Error");
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        const payload = action.payload as {
          error: string;
          navigate: NavigateFunction;
        };

        if (typeof payload?.error === "string") {
          state.error = payload.error;
          toast.error(payload.error);
        }
        payload.navigate("/login");
        state.loading = false;
      });

    //Get User
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        const { body, status, navigate } = action.payload;

        if (status === 200 && body?.user) {
          state.user = body?.user;
          state.message = body?.message;
          state.error = null;

          const role = body.user?.role;
          const path = window.location.pathname;

          if (role === ADMIN && !path.startsWith("/admin")) {
            navigate("/admin/dashboard");
          } else if (role === BUYER && !path.startsWith("/buyer")) {
            navigate("/buyer/dashboard");
          } else if (role === SELLER && !path.startsWith("/seller")) {
            navigate("/seller/dashboard");
          }
        } else {
          navigate("/login");
          toast.error("Login Error");
        }

        state.loading = false;
        state.bootstrap = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.bootstrap = false;
      });

    // Send forgot password email
    builder
      .addCase(sendForgotPasswordEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendForgotPasswordEmail.fulfilled, (state, action) => {
        const { body, status, navigate } = action.payload;

        if (status === 200) {
          state.message = body?.message;
          state.error = null;
          navigate("/forgot-password/check-email");
        } else {
          toast.error("Error sending reset password email");
        }

        state.loading = false;
      })
      .addCase(sendForgotPasswordEmail.rejected, (state) => {
        state.loading = false;
      });

    // Send forgot password email
    builder
      .addCase(verifyAndReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAndReset.fulfilled, (state, action) => {
        const { body, status, navigate } = action.payload;

        if (status === 201) {
          state.message = body?.message;
          state.error = null;
          navigate("/login");
        } else {
          toast.error("Error sending reset password email");
        }

        state.loading = false;
      })
      .addCase(verifyAndReset.rejected, (state) => {
        state.loading = false;
      });

    //Log out User
    builder
      .addCase(logOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        const { body, status, navigate } = action.payload;

        if (status === 200 || status === 304) {
          state.user = undefined;
          state.message = body?.message;
          navigate("/login");
        }

        state.loading = false;
      })
      .addCase(logOut.rejected, (state) => {
        state.loading = false;
      });
  },
});

// export const {} = auth.actions

export default auth.reducer;
