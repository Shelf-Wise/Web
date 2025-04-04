import { configureStore } from "@reduxjs/toolkit";
import { memberApiSlice } from "./member/MemberApiSlice";
import { bookApiSlice } from "./book/BookApiSlice";
import { AuthApiSlice } from "./Auth/AuthApiSlice";
import { blobApiSlice } from "./image/imageApiSlice";
import { genreApiSlice } from "./genre/genreApiSlice";

export const store = configureStore({
  reducer: {
    [memberApiSlice.reducerPath]: memberApiSlice.reducer,
    [bookApiSlice.reducerPath]: bookApiSlice.reducer,
    [AuthApiSlice.reducerPath]: AuthApiSlice.reducer, 
    [blobApiSlice.reducerPath]: blobApiSlice.reducer,
    [genreApiSlice.reducerPath]: genreApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      memberApiSlice.middleware,
      bookApiSlice.middleware,
      AuthApiSlice.middleware,
      blobApiSlice.middleware,
      genreApiSlice.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
