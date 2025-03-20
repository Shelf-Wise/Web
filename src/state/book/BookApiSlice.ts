import { ApiTags } from "@/types/ApiTags";
import { Book, BookRecommendation, BorrowedBook } from "@/types/Book";
import { ApiResponse } from "@/types/Response";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

export const bookApiSlice = createApi({
  reducerPath: "bookApi",
  baseQuery: fetchBaseQuery({ baseUrl: PUBLIC_URL }),
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
    getBookRecommendationById: builder.query<
      ApiResponse<BookRecommendation>,
      string
    >({
      query: (id) => `books/recommend/${id}`,
      providesTags: [ApiTags.BookRecommendation],
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
    returnBook: builder.mutation({
      query: ({ memberId, bookId }) => ({
        url: `services/ReturnBook`,
        method: "POST",
        body: { memberId, bookId },
      }),
      invalidatesTags: [ApiTags.Book, ApiTags.Member],
    }),
    getBorrowBooksByMember: builder.query<
      ApiResponse<Array<BorrowedBook>>,
      string
    >({
      query: (memberId) => ({
        url: `services/getBorrowedBooksBymemberId/${memberId}`,
        method: "GET",
      }),
      providesTags: (result) => {
        if (!result || !Array.isArray(result.value)) {
          return [{ type: ApiTags.Member, id: "LIST" }];
        }

        return [
          ...result.value.map((book) => ({
            type: ApiTags.Book,
            id: book.bookId,
          })),
          { type: ApiTags.Member, id: "LIST" },
        ];
      },
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useGetBookRecommendationByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useReturnBookMutation,
  useGetBorrowBooksByMemberQuery,
} = bookApiSlice;
