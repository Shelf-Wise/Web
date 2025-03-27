import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

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
      transformErrorResponse: (response: any) => {
        // Check for the specific error response structure
        if (response.data && !response.data.isSuccess) {
          const errorMessage = response.data.error?.description 
            || "Sign up failed. Please try again.";
          toast.error(errorMessage);
        }
        return response;
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
      transformErrorResponse: (response: any) => {
        // Check for the specific error response structure
        if (response.data && !response.data.isSuccess) {
          const errorMessage = response.data.error?.description 
            || "Login failed. Please check your credentials.";
          toast.error(errorMessage);
        }
        return response;
      },
    }),
  }),
});

export const { useSignUpUserMutation, useSignInUserMutation } = AuthApiSlice;