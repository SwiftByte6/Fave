import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavouriteItem {
  id: string;
  title: string;
  price: number;
  images: string[];
  description?: string;
  stock: number; // optional, just to show "In Stock" / "Out of Stock"
  category?: string   // ✅ added this
}

interface FavouriteState {
  favourites: FavouriteItem[];
}

const initialState: FavouriteState = {
  favourites: []
};

const favouriteSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addToFavourites: (state, action: PayloadAction<FavouriteItem>) => {
      const product = action.payload;
      const exists = state.favourites.find(item => item.id === product.id);

      if (!exists) {
        state.favourites.push(product);
      }
    },

    removeFromFavourites: (state, action: PayloadAction<string>) => {
      state.favourites = state.favourites.filter(item => item.id !== action.payload);
    },

    clearFavourites: (state) => {
      state.favourites = [];
    }
  }
});

// Export actions
export const {
  addToFavourites,
  removeFromFavourites,
  clearFavourites
} = favouriteSlice.actions;

export default favouriteSlice.reducer;
