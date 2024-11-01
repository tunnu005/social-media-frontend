// src/services/authService.js
import {  serverapi } from '@/data/server';
import axios from 'axios';

const server = serverapi;
export const login = async ({username, password}) => {
  const response = await axios.post(`${server}/api/auth/login`, { username, password }, {withCredentials: true});
  console.log(response);
  return response.data;
};

export const signup = async (formData) => {
  // console.log({ username, email, password, birthDate, role, profilePic });

  const response = await axios.post(`${server}/api/auth/signup`,formData,{withCredentials:true});
  return response.data;
};

