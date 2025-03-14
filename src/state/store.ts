import { configureStore } from "@reduxjs/toolkit";
import { memberApiSlice } from "./member/MemberApiSlice";
import { bookApiSlice } from "./book/BookApiSlice";
import { blobApiSlice } from "./image/imageApiSlice";

export const store = configureStore({
  reducer: {
    [memberApiSlice.reducerPath]: memberApiSlice.reducer,
    [bookApiSlice.reducerPath]: bookApiSlice.reducer,
    [blobApiSlice.reducerPath]: blobApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      memberApiSlice.middleware,
      bookApiSlice.middleware,
      blobApiSlice.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
