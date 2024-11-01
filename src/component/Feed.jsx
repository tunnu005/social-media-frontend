// src/components/Feed.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      {/* {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))} */}post
    </div>
  );
};

export default Feed;
