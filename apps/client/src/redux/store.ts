import { configureStore } from "@reduxjs/toolkit";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import authSlice from "./slice/auth";
import companySlice from "./slice/company";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    company: companySlice,
  },
});

export type MyDispatch = typeof store.dispatch;

export const MySelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
