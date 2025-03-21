import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

export const AuthApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: PUBLIC_URL }),
  endpoints: (builder) => ({
    signUpUser: builder.mutation({
      query: (user) => {
        console.log("Sending Request Payload:", user);
        return {
          url: "signUp",
          method: "POST",
          body: user,
        };
      },
    }),
    signInUser: builder.mutation({
      query: (user) => {
        console.log("Sending Request Payload:", user);
        return {
          url: "signIn",
          method: "POST",
          body: user,
        };
      },
    }),
  }),
});

export const { useSignUpUserMutation, useSignInUserMutation } = AuthApiSlice;
