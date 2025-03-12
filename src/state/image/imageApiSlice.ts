import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blobApiSlice = createApi({
    reducerPath: "blobApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7087/api/services/" }),
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