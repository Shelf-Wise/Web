import { ApiTags } from "@/types/ApiTags";
import { Book } from "@/types/Book";
import { ApiResponse } from "@/types/Response";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookApiSlice = createApi({
  reducerPath: "bookApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7087/api" }),
  tagTypes: Object.values(ApiTags),
  endpoints: (builder) => ({
    getBooks: builder.query<ApiResponse<Book[]>, void>({
      query: () => "books",
      providesTags: [ApiTags.Book],
    }),
    getBookById: builder.query<ApiResponse<Book>, string>({
      query: (id) => `books/${id}`,
      providesTags: [ApiTags.Book],
    }),
    addBook: builder.mutation({
      query: (book) => ({
        url: "books",
        method: "POST",
        body: book,
      }),
      invalidatesTags: [ApiTags.Book],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...book }) => ({
        url: `books`,
        method: "PUT",
        body: { ...book, id },
      }),
      invalidatesTags: [ApiTags.Book],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [ApiTags.Book],
    }),
    borrowBook: builder.mutation({
      query: ({ memberId, bookId }) => ({
        url: `services/BorrowBook`,
        method: "POST",
        body: { memberId, bookId },
      }),
      invalidatesTags: [ApiTags.Book, ApiTags.Member],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
} = bookApiSlice;
