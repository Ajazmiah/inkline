import React from "react";
import { useLink } from "@hooks/useLink/useLink";

const LeadArticle = ({ post }) => {
  const { handleNavigateToPost } = useLink();

  if (!post) return null;

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <article
        id="leadArticle"
        onClick={() => handleNavigateToPost(post)}
        className="group relative isolate flex flex-col gap-8 lg:flex-row lg:items-center cursor-pointer py-12 sm:py-16"
      >
        {/* Image Section - Takes up 60% of width on desktop */}
        <div className="w-full  shrink-0">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-gray-900/5 transition-shadow duration-300 group-hover:shadow-lg">
            <img
              src={post.coverImageName || post.coverImage}
              alt={post.title}
              loading="eager"
              className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </div>
          <div className="group relative max-w-xl">
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors sm:text-4xl">
              {post.title}
            </h3>
            <p className="mt-5 text-lg leading-8 text-gray-600 line-clamp-3">
              {post.summary}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 group-hover:text-gray-600 transition-colors">
            Read full article <span aria-hidden="true">→</span>
          </div>
        </div>

       
      </article>
    </div>
  );
};

export default LeadArticle;
