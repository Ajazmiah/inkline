import { apiSlice } from "./apiSlice";
import dotenv from "dotenv";


dotenv.config();

const USERS_URL =
  process.env.NODE_ENV === "development"
    ? "/api/users"
    : "https://inkline-backend.onrender.com/api/users";

console.log("ENV",  USERS_URL);

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signin`,
        method: "POST",
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile/update`,
        method: "PUT",
        body: data,
      }),
    }),
    userPublicProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/author/${data.userId}`,
        method: "GET",
      }),
    }),
    confirmEmail: builder.mutation({
      query:(data) => ({
        url: `${USERS_URL}/verifyemail`,
        method: "POST",
        body: data
      })
    }),
    forgotPassword: builder.mutation({
      query:(data) => ({
        url: `${USERS_URL}/resetpassword`,
        method: "POST",
        body: data
      })
    }),
    confirmResetPasswordToken: builder.mutation({
      query:(data) => ({
        url: `${USERS_URL}/confirm-reset-password-token`,
        method: "POST",
        body: data
      })
    }),
    resetPassword: builder.mutation({
      query:(data) => ({
        url: `${USERS_URL}/set-new-password`,
        method: "POST",
        body: data
      })
    }),
    checkIsVerified: builder.mutation({
     query:(data) => ({
      url: `${USERS_URL}/verify-check`,
      method: "POST",
      body: data
     })
    })
  }),
});

// If We're fetching data then it would be
// called useLoginQuery
export const {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useUpdateProfileMutation,
  useUserPublicProfileMutation,
  useConfirmEmailMutation,
  useForgotPasswordMutation,
  useConfirmResetPasswordTokenMutation,
  useResetPasswordMutation,
  useCheckIsVerifiedMutation,
} = usersApiSlice;
