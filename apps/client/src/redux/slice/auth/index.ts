import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { getUser, loginUser, verifyOtp } from "./asyncFn";
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
            navigate("/admin");
          } else if (role === BUYER) {
            navigate("/buyer");
          } else if (role === SELLER) {
            navigate("/seller");
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
          if (body.user?.admin?.id) {
            navigate("/admin");
          } else if (body.user?.buyer?.id) {
            navigate("/buyer");
          } else if (body.user?.seller?.id) {
            navigate("/seller");
          } else {
            navigate("/login");
          }
        }

        state.loading = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

// export const {} = auth.actions

export default auth.reducer;
