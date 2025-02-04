import {configureStore, combineReducers} from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: "root",
    storage,
    whitelist: []
}

const persistedReducer = persistReducer(persistConfig, combineReducers({
    auth: authReducer
}))

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
})

export const persistor = persistStore(store);
