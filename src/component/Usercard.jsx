import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow = (e) => {
        e.stopPropagation(); // Prevent navigation from Link when button is clicked
        setIsFollowing(!isFollowing);
        // Handle follow/unfollow logic here, e.g., make an API call
    };

    return (
        <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-100 transition duration-200">
            <Link to={`/profile/${user._id}/${user.username}`} className="flex items-center flex-1">
                <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src={user.profilePic || 'path/to/default/image.jpg'} alt={user.username} className="w-full h-full object-cover" />
                    <AvatarFallback>{user.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="text-lg font-semibold">{user.username}</p>
                </div>
            </Link>
            {/* <button
                onClick={handleFollow}
                className={`py-1 px-3 rounded-full text-white font-semibold transition duration-300 ${
                    isFollowing
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
                {isFollowing ? 'Following' : 'Follow'} */}
            {/* </button> */}
        </div>
    );
};

export default UserCard;
