import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {
  // Use 'any' or your specific RootState type here
  const { userInfo } = useSelector((state) => state.auth);

  // Return null explicitly for React when hiding the component
  if (userInfo) return null;

  return (
    <div className="relative isolate bg-white pt-14">
      {/* Background Pattern - Subtle Gray Grid */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#f3f4f6] to-[#e5e7eb] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      
      {/* Decorative Grid SVG */}
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="white" />
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
      </svg>

      <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Spread your knowledge
          </h1>
          
          {/* Sub Tagline */}
          <p className="mt-6 text-lg leading-8 text-gray-600 font-medium">
            Learn. Share. Inspire.
          </p>

          <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
            Join a minimalist community of writers-
            No clutter, just content.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/create"
              className="btn-round-black text-white"
            >
              Start Writing
            </Link>
            
            <a
              href="#leadArticle"
              className="btn-round-black bg-white text-black"
            >
              Read Articles
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;