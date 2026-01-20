import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { getUser, loginUser } from "./asyncFn";
import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";

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
          if (payload.error === "User profile inactive") {
            state.error = payload.error;
            toast.error(payload.error);
            payload.navigate("/profile-inactive");
          } else {
            state.error = payload.error;
            toast.error(payload.error);
          }
        }

        state.loading = false;
      });

    //Get User
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        const { body, status } = action.payload;

        if (status === 200 && body?.user) {
          state.user = body?.user;
          state.message = body?.message;
          state.error = null;
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
