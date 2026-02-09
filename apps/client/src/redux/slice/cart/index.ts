import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { addToCart, getMyCart, removeFromCart } from "./asyncFn";
import { toast } from "sonner";

const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItemToCartId: (state, action) => {
      state.itemToCartId = action.payload;
    },
  },
  extraReducers(builder) {
    // Create Update product
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { body, status } = action.payload;

        if (status === 200) {
          state.message = body?.message;
          toast.success(body?.message);
        }

        state.loading = false;
      })
      .addCase(addToCart.rejected, (state) => {
        state.loading = false;
      });

    // Get Seller products
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { body, status } = action.payload;

        if (status === 200) {
          state.message = body?.message;
          toast.success(body?.message);
        }

        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state) => {
        state.loading = false;
      });

    // Get All products
    builder
      .addCase(getMyCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyCart.fulfilled, (state, action) => {
        const { body, status } = action.payload;

        if (status === 200) {
          state.cart = body?.cart;
          state.message = body?.message;
        }

        state.loading = false;
      })
      .addCase(getMyCart.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setItemToCartId } = cart.actions;

export default cart.reducer;
