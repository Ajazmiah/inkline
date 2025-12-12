import React from "react";
import Styles from "./FeaturedCard.module.css";
import classNames from "classnames";
import Image from "../Image/Image";
import { useLink } from "@hooks/useLink/useLink";

function FeaturedCard({ post }) {
  const { handleNavigateToPost } = useLink();

  return (
    <div
      onClick={() => handleNavigateToPost(post)}
      className="flex max-w-[680px] mx-auto gap-4 items-start cursor-pointer"
    >
      {/* Image on left */}
      <div className="flex-shrink-0 w-40 h-24 overflow-hidden rounded">
        <img
          src={post?.coverImageName || post.coverImage}
          alt={post?.alt || "cover photo of the post"}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Text on right */}
      <div className="flex-1 min-w-0">
        <h2 className="md:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 truncate">
          {post.title}
        </h2>
        <p className="text-gray-600 break-words line-clamp-3 text-sm">
          {post.summary || "Summary is not available"}
        </p>
      </div>
    </div>
  );
}

export default FeaturedCard;
