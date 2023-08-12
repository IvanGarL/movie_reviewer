import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './auth/auth.slice';
import { usersReducer } from './users/users.slice';

export * from './auth/auth.slice';
export * from './users/users.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer
    },
});