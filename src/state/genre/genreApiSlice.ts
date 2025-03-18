import { Genre } from "@/types/Genre";
import { ApiResponse } from "@/types/Response";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

export const genreApiSlice = createApi({
  reducerPath: "genreApi",
  baseQuery: fetchBaseQuery({ baseUrl: PUBLIC_URL }),
  tagTypes: ["Genre"],
  endpoints: (builder) => ({
    getAllGenre: builder.query<ApiResponse<Array<Genre>>, void>({
      query: () => ({
        url: "genres",
        method: "GET",
      }),
      providesTags: ["Genre"]
    }),
    
    getGenreById: builder.query<ApiResponse<Genre>, string>({
      query: (id) => ({
        url: `genres/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Genre", id }]
    }),
    
    addGenre: builder.mutation<ApiResponse<Genre>, Genre>({
      query: (genre) => ({
        url: "genres",
        method: "POST",
        body: genre,
      }),
      invalidatesTags: ["Genre"]
    }),
    
    updateGenre: builder.mutation<ApiResponse<Genre>, Genre>({
      query: (genre) => ({
        url: `genres/${genre.id}`,
        method: "PUT",
        body: genre,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Genre", id }, "Genre"]
    }),
    
    deleteGenre: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `genres/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Genre"]
    }),
  }),
});

export const {
  useGetAllGenreQuery,
  useGetGenreByIdQuery,
  useAddGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation
} = genreApiSlice;