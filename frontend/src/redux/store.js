import {configureStore, combineReducers} from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import uiReducer from './slice/uiSlice';
import questionsReducer from './slice/questionsSlice';
import assignmentReducer from './slice/assignmentSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: "root",
    storage,
    whitelist: ['ui', 'auth','questions', 'assignment']
}

const persistedReducer = persistReducer(persistConfig, combineReducers({
    auth: authReducer, 
    ui: uiReducer, 
    questions : questionsReducer,
    assignment : assignmentReducer
}))

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
})

export const persistor = persistStore(store);
