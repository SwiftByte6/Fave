// app/providers.tsx
'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/Redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist';
let persistor = persistStore(store)


export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        {children}
        </PersistGate>
          
        </Provider>;
}
