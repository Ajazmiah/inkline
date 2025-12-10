import React, { useState, useEffect } from "react";
import ReactHtmlParser from "html-react-parser";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Utils & API
import {
  useGetPostMutation,
  useDeletePostMutation,
} from "../../slices/postsApiSlice";
import { formatDate, sanitizeContent } from "../../utils";

// Components
import AuthorBylineCard from "../../components/AuthorBylineCard/AuthorBylineCard";
import ModalRectangular from "../../components/Modal/ModalRectangular";
import { useBackdrop } from "../../components/Backdrop/Backdrop";
import BlogEdit from "../../components/BlogEdit/BlogEdit";
import Sidebar from "../../components/SideBar/SideBar";
import { getIcon } from "../../components/Icon";

function SingleBlogScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Redux & API
  const { userInfo } = useSelector((state) => state.auth);
  const [getPost] = useGetPostMutation();
  const [deletePost] = useDeletePostMutation();
  
  // Local State
  const [post, setPost] = useState(null);
  const [modalContentType, setModalContentType] = useState("");
  const [postUpdated, setPostUpdated] = useState(false);
  const { backdrop, setBackdrop } = useBackdrop();

  // Process HTML Content
  const sanitizedHTML = sanitizeContent(post?._doc?.body);
  const POST = ReactHtmlParser(sanitizedHTML);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPost({ id }).unwrap();
        setPost(fetchedPost);
      } catch (err) {
        if (err.status === 404) {
          navigate("/404");
        } else {
          toast.error(err?.data?.message || "Error loading post");
        }
      }
    };

    fetchPost();
  }, [getPost, id, postUpdated, navigate]);

  const handleApproveDeletion = async () => {
    try {
      await deletePost({ id }).unwrap();
      toast.success("Post is deleted");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Error deleting post");
    }
  };

  const handleModal = (handleType) => {
    setBackdrop((prev) => !prev);
    setModalContentType(handleType);
  };

  const handlePostUpdated = () => setPostUpdated((prev) => !prev);

  // --- Modal Content ---
  const modalContent = modalContentType === "delete" && (
    <div className="text-center p-6">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Post?</h3>
      <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
      <div className="flex justify-center gap-3">
        <button 
            onClick={() => setBackdrop(false)}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all"
        >
            Cancel
        </button>
        <button 
            onClick={handleApproveDeletion}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-500 shadow-sm transition-all"
        >
            Delete
        </button>
      </div>
    </div>
  );

  const EDIT_BLOG = post && modalContentType !== "delete" && (
    <BlogEdit
      editTitle={post._doc.title}
      handlePostUpdated={handlePostUpdated}
      editSummary={post._doc.summary}
      quillValue={post?._doc?.body}
      coverImage={post?._doc?.coverImageName}
      id={post._doc._id}
      handleBackdrop={() => setBackdrop((prev) => !prev)}
      backdrop={backdrop}
    />
  );

  if (!post) return null; 

  const isAuthor = post?._doc.authorId === userInfo?._id;

  return (
    <div className="min-h-screen bg-white">
      {/* Background Decor - adds a very subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-gray-50 to-transparent -z-10" />

      {backdrop && (
        <ModalRectangular
          handleBackdrop={() => setBackdrop((prev) => !prev)}
          backdrop={backdrop}
        >
          {modalContent}
          {EDIT_BLOG}
        </ModalRectangular>
      )}

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-12 pb-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          
          {/* --- LEFT COLUMN: Main Content (8/12) --- */}
          <main className="lg:col-span-8">
            
            {/* Header Section */}
            <header className="mb-10">
                {/* Meta Tag */}
                <div className="mb-6 flex items-center gap-3">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        {post._doc.tags?.[0] || "Article"}
                    </span>
                    <span className="text-sm text-gray-400">
                        {formatDate(post?.createdAt)}
                    </span>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6 leading-[1.1]">
                    {post._doc.title}
                </h1>
                <p className="text-xl leading-relaxed text-gray-500 font-light">
                    {post._doc.summary}
                </p>
            </header>

            {/* Author & Actions Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-8 mb-10 gap-4">
               <div className="flex items-center gap-4">
                  {/* Clean Author Card */}
                  <div className="flex items-center gap-3">
                    {/* Assuming AuthorBylineCard renders an avatar - if not, you might want to extract the img here */}
                    <AuthorBylineCard author={post.author} />
                  </div>
               </div>

              {isAuthor && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleModal("edit")}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all"
                  >
                    {getIcon("update")} <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button 
                    onClick={() => handleModal("delete")}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm ring-1 ring-inset ring-red-100 hover:bg-red-50 transition-all"
                  >
                    {getIcon("delete")} <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Main Image */}
            <div className="mb-12 overflow-hidden rounded-2xl bg-gray-100 shadow-md ring-1 ring-gray-900/5">
                <img
                  src={post?._doc.coverImageName || post?._doc.coverImage}
                  alt={post._doc.title}
                  className="h-auto w-full object-cover"
                  loading="eager"
                />
            </div>

            {/* THE CONTENT 
                - 'prose' activates typography plugin
                - 'prose-lg' makes text larger for reading
                - 'font-serif' makes it feel like Medium/NYT
            */}
            <article className="prose prose-lg prose-slate max-w-none font-serif 
                prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-8
                prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-lg
                prose-pre:bg-gray-900 prose-pre:shadow-lg prose-pre:rounded-xl">
              {POST}
            </article>

            {/* Post-read Divider */}
            <div className="mt-16 flex items-center justify-center">
                 <span className="h-1 w-24 rounded-full bg-gray-200"></span>
            </div>

          </main>

          {/* --- RIGHT COLUMN: Sticky Sidebar (4/12) --- */}
          <aside className="lg:col-span-4 lg:pl-8">
             <div className="sticky top-10">
                {/* Decorative Label */}
                <div className="flex items-center gap-2 mb-6 text-gray-900">
                    <div className="h-1 w-1 rounded-full bg-gray-900"></div>
                    <h3 className="text-xs font-bold uppercase tracking-widest">
                        More to Read
                    </h3>
                </div>

                {/* Sidebar Component Wrapper */}
                <div className="border-l-2 border-gray-100 pl-6">
                    <Sidebar>
                        <Sidebar.RelatedPost />
                    </Sidebar>
                </div>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

export default SingleBlogScreen;