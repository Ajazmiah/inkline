import { apiSlice } from "./apiSlice";
import dotenv from "dotenv";

dotenv.config();

const POSTS_URL =
  process.env.NODE_ENV === "development"
    ? "/api/blog"
    : "https://inkline-backend.onrender.com/api/blog";

console.log("URL", POSTS_URL);

const postsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allUserPosts: builder.mutation({
      query: () => ({
        url: `${POSTS_URL}/create`,
        method: "GET",
      }),
    }),
    submitPost: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}/create`,
        method: "POST",
        body: data,
      }),
    }),

    //single Post
    getPost: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}/post/${data.id}`,
        method: "GET",
      }),
    }),
    editPost: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}/edit`,
        method: "POST",
        body: data,
      }),
    }),
    getUserPosts: builder.mutation({
      query: (limit) => ({
        url: `${POSTS_URL}/allPost?limit=${limit}`,
        method: "GET",
      }),
    }),
    deletePost: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}/deletepost`,
        method: "POST",
        body: data,
      }),
    }),

    expludeUserPosts: builder.mutation({
      query: (limit) => ({
        url: `${POSTS_URL}/getUserPosts?limit=${limit}`,
        method: "GET",
      }),
    }),
    sitemap: builder.mutation({
      query:() => ({
        url: `${POSTS_URL}/sitemap.xml`,
        method: 'GET'
      })
    })
  }),
});

export const {
  useAllUserPostsMutation,
  useSubmitPostMutation,
  useGetPostMutation,
  useDeletePostMutation,
  useEditPostMutation,
  useGetUserPostsMutation,
  useExpludeUserPostsMutation,
  
} = postsApi;
