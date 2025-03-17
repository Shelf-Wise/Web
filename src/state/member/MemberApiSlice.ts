import { ApiTags } from "@/types/ApiTags";
import { Member } from "@/types/Member";
import { ApiResponse } from "@/types/Response";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

export const memberApiSlice = createApi({
  reducerPath: "memberApi",
  baseQuery: fetchBaseQuery({ baseUrl: PUBLIC_URL }),
  tagTypes: Object.values(ApiTags),
  endpoints: (builder) => ({
    getMembers: builder.query<ApiResponse<Member[]>, void>({
      query: () => "members",
      providesTags: [ApiTags.Member],
    }),
    getMemberById: builder.query<ApiResponse<Member>, string>({
      query: (id) => `members/${id}`,
      providesTags: [ApiTags.Member],
    }),
    addMember: builder.mutation({
      query: (member) => ({
        url: "members",
        method: "POST",
        body: member,
      }),
      invalidatesTags: [ApiTags.Member],
    }),
    updateMember: builder.mutation({
      query: ({ id, ...member }) => ({
        url: `members`,
        method: "PUT",
        body: { ...member, id },
      }),
      invalidatesTags: [ApiTags.Member],
    }),
    deleteMember: builder.mutation({
      query: (id) => ({
        url: `members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [ApiTags.Member],
    }),
  }),
});

export const {
  useGetMembersQuery,
  useGetMemberByIdQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = memberApiSlice;
