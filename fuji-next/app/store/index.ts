// store/index.ts
'use client'
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import fruitReducer from './slices/fruitSlice';
import createReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import orderReducer from './slices/orderSlice';
import { useDispatch } from 'react-redux';
import newReducer from './slices/newsSlice';
import customerReducer from './slices/customerSlice';
import profileReducer from './slices/profileSlice';
import statiticsReducer from './slices/dashboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    fruit : fruitReducer,
    cart : createReducer,
    category : categoryReducer,
    order : orderReducer,
    profile : profileReducer,
    new : newReducer,
    customer : customerReducer,
    dashboard : statiticsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
