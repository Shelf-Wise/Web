import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AuthApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7087" }), 
  endpoints: (builder) => ({
    signUpUser: builder.mutation({
      query: (user) => {
        console.log("Sending Request Payload:", user); 
        return {
          url: "authentication/signUp",
          method: "POST",
          body: user,
        };
      },
    }),
  }),
});

export const { useSignUpUserMutation } = AuthApiSlice;