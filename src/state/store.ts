import { configureStore } from "@reduxjs/toolkit";
import { memberApiSlice } from "./member/MemberApiSlice";
import { bookApiSlice } from "./book/BookApiSlice";

export const store = configureStore({
  reducer: {
    [memberApiSlice.reducerPath]: memberApiSlice.reducer,
    [bookApiSlice.reducerPath]: bookApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      memberApiSlice.middleware,
      bookApiSlice.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
