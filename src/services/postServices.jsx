// src/services/postService.js
import axios from 'axios';
import {  serverapi } from '@/data/server';

 

export const fetchPosts = async (userId) => {
  const response = await axios.get(`${serverapi}/api/posts/getpost/${userId}`, {
   withCredentials: true
  });
  return response.data;
};


export const createPost = async (Formdata) => {
  const response = await axios.post(`${serverapi}/api/posts/create`,Formdata,{withCredentials: true});
  return response.data;
}

export const gethomepost = async({page,limit})=>{
  const response = await axios.get(`${serverapi}/api/posts/getHome/${page}/${limit}`,{withCredentials: true})
  return response.data;
}


export const addlike = async({postId,liked})=>{
    const response = await axios.post(`${serverapi}/api/posts/addlike`,{postId,liked},{withCredentials: true})
    return response.data;
}

export const addComment = async({postId,text}) =>{
  const response = await axios.post(`${serverapi}/api/posts/addcomment`,{postId,text},{withCredentials: true})
  return response.data;
}