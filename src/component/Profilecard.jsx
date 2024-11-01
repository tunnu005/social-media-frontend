import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileCard({
  profilePicture,
  username,
  bio,
  followers,
  following,
  posts,
  userId
}) {

  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm mx-auto cursor-pointer " onClick={()=>{navigate(`/Profile/${userId}/${username}`)}}>
      {/* Profile Image */}
      <div className="flex justify-center mt-6 ">
        {/* <img
          className="h-24 w-24 rounded-full border-4 border-gray-200 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-3 hover:shadow-xl hover:shadow-gray-500/50"
          src={profilePicture}
          alt={`${username}'s profile`}
        /> */}
       <Avatar className="w-24 h-24 relative overflow-hidden rounded-full transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-3 hover:shadow-xl hover:shadow-gray-500/50">
                        <AvatarImage src={profilePicture} className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-3 hover:shadow-xl hover:shadow-gray-500/50" />
                       
                    </Avatar>

      </div>

      {/* User Information */}
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800">{username}</h2>
        <p className="text-gray-600 mt-2">{bio}</p>

        {/* Stats */}
        <div className="flex justify-around mt-4">
          {/* <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">{posts}</p>
            <p className="text-gray-500">Posts</p>
          </div> */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">{followers.length}</p>
            <p className="text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">{following.length}</p>
            <p className="text-gray-500">Following</p>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="mt-6 flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600">
            Follow
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-100">
            Message
          </button>
        </div> */}
      </div>
    </div>
  );
}
