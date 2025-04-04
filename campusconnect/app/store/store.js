// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/authslice/authslice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // Redux Toolkit includes redux-thunk by default
});