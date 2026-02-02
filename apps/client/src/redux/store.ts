import { configureStore } from "@reduxjs/toolkit";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import authSlice from "./slice/auth";
import companySlice from "./slice/company";
import productSlice from "./slice/product";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    company: companySlice,
    product: productSlice,
  },
});

export type MyDispatch = typeof store.dispatch;

export const MySelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
