import React from "react";

const BlogText = () => {
  return (
    <div className="w-[50%] flex flex-col justify-center mx-auto mt-14">
      <h1 className="text-center text-3xl capitalize font-semibold text-white">
        Latest Blogs
      </h1>
      <p className="mt-5 text-white text-sm">
        A blog app allows users to create, read, update, and delete blog posts.
        It supports rich content, categorization, and SEO-friendly URLs,
        providing an intuitive interface for managing articles and engaging with
        readers through comments or social sharing.
      </p>
    </div>
  );
};

export default BlogText;
