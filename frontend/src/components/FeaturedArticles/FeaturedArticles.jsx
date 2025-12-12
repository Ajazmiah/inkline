import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LeadArticle from "../LeadArticle/LeadArticle";
import FeaturedCard from "../FeaturedCard/FeaturedCard";
import {
  useGetUserPostsMutation,
  useExpludeUserPostsMutation,
} from "../../slices/postsApiSlice";

function FeaturedArticles() {
  const { userInfo } = useSelector((state) => state.auth);
  
  // API Mutations
  const [getPosts] = useGetUserPostsMutation();
  const [getExludedUserPosts] = useExpludeUserPostsMutation();

  // State
  const [posts, setPosts] = useState([]);
  const [leadPost, setLeadPost] = useState(null);
  const [noMore, setNoMore] = useState(false);
  const [limit, setLimit] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        setLoading(true);
        // Toggle between public feed or excluded user feed
        const allPost = userInfo
          ? await getExludedUserPosts(limit).unwrap()
          : await getPosts(limit).unwrap();

        setPosts(allPost.SignedPosts);
        console.log("ALL POST", allPost)
        
        // Ensure the lead post is always the first one returned
        if (allPost.SignedPosts && allPost.SignedPosts.length > 0) {
          setLeadPost(allPost.SignedPosts[0]);
        }

        // Check if we reached the total count
        if (allPost.SignedPosts.length === allPost.totalPosts) {
          setNoMore(true);
        }
      } catch (error) {
        setNoMore(true);
        toast.error(error?.data?.message || "Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    getAllPosts();
  }, [limit, userInfo, getExludedUserPosts, getPosts]);

  // Loading/Empty State
  if (!loading && posts?.length < 1) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900">No Feed...</h1>
        <p className="mt-2 text-gray-500">Public feed will show up here when available</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Grid Layout: Lead (Left) vs List (Right) */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Lead Article (Takes up 8/12 columns on desktop) */}
        <div className="lg:col-span-12">
          {leadPost && (
            <div className="border-b border-gray-200 pb-8 lg:border-none lg:pb-0">
               {/* This is the big article component we built previously */}
              <LeadArticle post={leadPost} />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar List (Takes up 4/12 columns on desktop) */}
        <div className="flex flex-col gap-8 lg:col-span-12 lg:border-l lg:border-gray-100 lg:pl-12">
          
          <div className="border-b border-gray-900 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Latest Articles
            </h3>
          </div>

          <div className="flex flex-col gap-8">
            {posts.map((post) => {
              // Skip the lead post so it doesn't appear twice
              if (leadPost && post._id === leadPost._id) return null;
              
              return (
                <div key={post._id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0 ">
                  <FeaturedCard post={post} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Load More Button Area */}
      <div className="mt-16 flex justify-center border-t border-gray-100 pt-10">
        {noMore ? (
          <span className="text-sm font-medium text-gray-400">
            No more articles
          </span>
        ) : (
          <button
            onClick={() => setLimit((prev) => prev + 3)}
            disabled={loading}
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:ring-gray-400 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </section>
  );
}

export default FeaturedArticles;