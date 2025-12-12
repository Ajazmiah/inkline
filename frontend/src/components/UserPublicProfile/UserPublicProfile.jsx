import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserPublicProfileMutation } from "../../slices/usersApiSlice";
import FeaturedCard from "../FeaturedCard/FeaturedCard";
import Border from "../Atoms/Border/Border";
import AuthorBylineCard from "../AuthorBylineCard/AuthorBylineCard";
import AuthorBio from "../AuthorBio/AuthorBio";
import UserProfileInfo from "../UserProfileInfo/UserProfileInfo";
import ProfilePost from "../ProfilePost/ProfilePost";

function UserPublicProfile() {
  const { id } = useParams();
  const userId = id.split("-")[1];

  const [gerUserProfile] = useUserPublicProfileMutation();
  const [posts, setPosts] = useState(null);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await gerUserProfile({ userId }).unwrap();
        const { authorInfo, SignedPosts } = fetchedPost;
        console.log("FECTED", SignedPosts);
        setPosts(SignedPosts);
        setAuthor(authorInfo);
      } catch (err) {
        if (err.status === 404) {
          navigate("/404");
        } else {
          console.log(err);
        }
      }
    };

    fetchPost();
  }, [gerUserProfile, userId]);

  if (!posts) return;
  console.log("AUTHOR", author);

  return (
    <div>
      <UserProfileInfo userInfo={author} />

      <section className="mt-20 px-6">
        <ProfilePost posts={posts} />
      </section>
    </div>
  );
}

export default UserPublicProfile;
