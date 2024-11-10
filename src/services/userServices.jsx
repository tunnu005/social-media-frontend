import axios from 'axios';
import {  serverapi } from '@/data/server';


export const getProfile = async (userId) => {
    // console.log(typeof username);
    const responce = await axios.get(`${serverapi}/api/users/profile/${userId}`,{withCredentials : true});
    return responce.data
}

export const getUser = async () => {
    const responce = await axios.get(`${serverapi}/api/users/user`,{withCredentials : true});
    return responce.data
}

export const followUser = async ({usernameToFollow,currentUsername}) => {
    // console.log(usernameToFollow,usernameToFollow);
    const responce = await axios.post(`${serverapi}/api/users/follow`, { usernameToFollow,currentUsername }, {withCredentials : true});
    return responce.data
}

export const unfollowUser = async ({usernameToFollow, currentUsername}) => {
    // console.log(usernameToFollow,currentUsername);
    const responce = await axios.post(`${serverapi}/api/users/unfollow`, { usernameToFollow, currentUsername }, {withCredentials : true});
    return responce.data
}