import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import listingReducer from './slices/listingSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        listing: listingReducer,
        booking: bookingReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ["auth/login/fulfilled", "auth/register/fulfilled"],
                // Ignore these field paths in all actions
                ignoredActionPaths: ["payload.date", "payload.user.date"],
                // Ignore these paths in the state
                ignoredPaths: ["auth.user.date"],
            },
        }),
});

export default store; 