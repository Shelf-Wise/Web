import { Genre } from "@/types/Genre";
import { ApiResponse } from "@/types/Response";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

export const genreApiSlice = createApi({
    reducerPath: "genreApi",
    baseQuery: fetchBaseQuery({ baseUrl: PUBLIC_URL}),
    endpoints: (builder) => ({
        getAllGenre: builder.query<ApiResponse<Array<Genre>>, void>({
            query: () => ({
                url: "genres",
                method: "GET",
            })
        }),
    }),
});

export const {
    useGetAllGenreQuery
} = genreApiSlice;