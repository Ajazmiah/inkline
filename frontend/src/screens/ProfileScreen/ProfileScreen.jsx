import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../slices/postsSlice";
import { useAllUserPostsMutation } from "../../slices/postsApiSlice";
import { Link } from "react-router-dom";
import PostCard from "../../components/PostCard/PostCard";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import Image from "../../components/Image/Image";
import UserProfileInfo from "../../components/UserProfileInfo/UserProfileInfo";
import FeaturedCard from "../../components/FeaturedCard/FeaturedCard";
import Border from "../../components/Atoms/Border/Border";

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.posts);

  const [getPosts] = useAllUserPostsMutation();

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const allPost = await getPosts().unwrap();
        dispatch(setPosts(allPost));
      } catch (err) {
        console.log("Error:", err);
      }
    };

    getAllPosts();
  }, [dispatch, getPosts]);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      {/* Center container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Profile header / info */}

        {/* Allow the UserProfileInfo component to render itself.
              Placed inside a responsive flex so it aligns nicely on wider screens. */}

        <div className="min-w-0 flex-1">
          {/* Let the existing component show name, bio, and the UpdateAccount child */}
          <UserProfileInfo userInfo={userInfo}>
            <UserProfileInfo.UpdateAccount />
          </UserProfileInfo>
        </div>

        {/* Posts / featured list */}
        <section className="mt-8">
          {/* If no posts */}
          {!posts || posts.length === 0 ? (
            <div className="rounded-lg bg-white/60 p-8 text-center text-sm text-gray-600 shadow-sm">
              <p className="mb-3">You haven't published any posts yet.</p>
              <Link
                to="/create"
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Start Writing
              </Link>
            </div>
          ) : (
            /* Responsive grid: 1 column on mobile, 2 on md, 3 on lg (adjust to taste) */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const key = post._id || post.id || post.slug || Math.random();
                return (
                  <div key={key} className="flex flex-col">
                    <FeaturedCard post={post} />
                    <div className="mt-4">
                      <Border />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Optionally add a footer spacing block */}
        <div className="mt-12" />
      </div>
    </main>
  );
};

export default ProfileScreen;
