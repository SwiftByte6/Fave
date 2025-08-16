// store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/Redux/cartSlice';
import favouriteReducer from '@/Redux/FavSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// persist config for cart
const cartPersistConfig = {
  key: 'cart',
  version: 1,
  storage,
};

// persist config for favourites
const favouritePersistConfig = {
  key: 'favourites',
  version: 1,
  storage,
};

// wrap reducers with persist
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedFavouriteReducer = persistReducer(favouritePersistConfig, favouriteReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    favourites: persistedFavouriteReducer, // 👈 added favourites
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
