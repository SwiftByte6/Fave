import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  stock: number;         // available stock (mapped from backend quantity if provided)
  cartQuantity: number;  // how many in cart
}

interface CartState {
  cart: CartItem[];
}

const initialState: CartState = {
  cart: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      const product = action.payload;
      const normalizedId = String(product.id);

      const existing = state.cart.find(item => String(item.id) === normalizedId);

      // Resolve stock from multiple possible fields, fallback to Infinity if not provided
      const resolvedStock: number = typeof product.stock === 'number'
        ? product.stock
        : (typeof product.quantity === 'number' ? product.quantity : Number.POSITIVE_INFINITY);

      if (existing) {
        if (!Number.isFinite(existing.stock) || existing.cartQuantity < existing.stock) {
          existing.cartQuantity += 1;
        } else {
          console.log('Stock limit reached');
        }
      } else {
        state.cart.push({
          ...product,
          id: normalizedId,
          stock: resolvedStock,
          cartQuantity: typeof product.cartQuantity === 'number' && product.cartQuantity > 0
            ? product.cartQuantity
            : 1
        });
      }
    },

    removeCart: (state, action: PayloadAction<any>) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },

    removeEveryThing: (state) => {
      state.cart = [];
    },

    updateCartQuantity: (state, action: PayloadAction<{ id: string | number, quantity: number }>) => {
      const { id, quantity } = action.payload;
      const normalizedId = String(id);
      const item = state.cart.find(item => String(item.id) === normalizedId);
      if (item) {
        const atLeastOne = Math.max(1, quantity);
        const clampedQuantity = Number.isFinite(item.stock)
          ? Math.max(1, Math.min(atLeastOne, item.stock))
          : atLeastOne;
        item.cartQuantity = clampedQuantity;
      }
    }
  }
});

// Export actions
export const {
  addToCart,
  removeCart,
  removeEveryThing,
  updateCartQuantity
} = cartSlice.actions;

export default cartSlice.reducer;
