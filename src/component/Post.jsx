// src/components/Post.jsx
import React from 'react';

const Post = ({ post }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded mb-4">
      <h3 className="text-xl font-bold">{post.user.username}</h3>
      <p className="text-gray-700 mt-2">{post.content}</p>
      <button className="text-blue-500 hover:underline mt-2">Like</button>
    </div>
  );
};

export default Post;
