import { configureStore } from "@reduxjs/toolkit";
import countPageReducer from './features/countPageSlice'
import cartReducer  from './features/cart'
import { productApi } from "./services/productApi";
import { userApi } from "./services/usersApi";
import { setupListeners} from '@reduxjs/toolkit/query';
import loginReducer from './features/userSlice';
import authReducer from './features/userSlice';
import { reviewsApi } from "./services/reviewsApi";

export const store = configureStore({
    reducer: {
        countPageReducer,
        cartReducer,
        [productApi.reducerPath]: productApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [reviewsApi.reducerPath]: reviewsApi.reducer,
        loginReducer, 
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat([productApi.middleware, userApi.middleware, reviewsApi.middleware]),
})

 setupListeners(store.dispatch)