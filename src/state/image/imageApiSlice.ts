import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PUBLIC_URL = `${import.meta.env.VITE_PUBLIC_URL}services/`;

export const blobApiSlice = createApi({
    reducerPath: "blobApi",
    baseQuery: fetchBaseQuery({ baseUrl: PUBLIC_URL }),
    endpoints: (builder) => ({
        uploadBlob: builder.mutation({
            query: (image) => ({
                url: "upload-image",
                method: "POST",
                body: image,
            })
        }),
    }),
});

export const {
    useUploadBlobMutation
} = blobApiSlice;