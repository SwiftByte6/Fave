import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  stock: number;         // renamed from backend's "quantity"
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
      const existing = state.cart.find(item => item.id === product.id);

      if (existing) {
        if (existing.cartQuantity < existing.stock) {
          existing.cartQuantity += 1;
        } else {
          console.log('Stock limit reached');
        }
      } else {
        state.cart.push({
          ...product,
          stock: product.quantity,      // rename backend "quantity" to "stock"
          cartQuantity: 1               // start with 1 in cart
        });
      }
    },

    removeCart: (state, action: PayloadAction<any>) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },

    removeEveryThing: (state) => {
      state.cart = [];
    },

    updateCartQuantity: (state, action: PayloadAction<{ id: string, quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find(item => item.id === id);
      if (item) {
        const clampedQuantity = Math.max(1, Math.min(quantity, item.stock));
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
