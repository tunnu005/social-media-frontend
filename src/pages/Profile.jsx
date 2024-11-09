import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { ScrollArea } from "../components/ui/scroll-area";
import { Heart, MessageCircle } from "lucide-react";
import Lilmenu from "../component/lilmenubar";
import { useNavigate, useParams } from 'react-router-dom';
import { followUser, getProfile, unfollowUser } from '@/services/userServices';
import { fetchPosts } from '@/services/postServices';
// import Cookies from 'js-cookie';

const CoolProfilePage = () => {
    const [selectedPost, setSelectedPost] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [profile, setProfile] = useState({ username: '', bio: '', followers: 0, following: 0 });
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);  // New state for follow status
    const [loading, setLoading] = useState(false);
    const { userId, username } = useParams();
    console.log(username)
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const handleLike = () => {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikes(likes + (newLikedState ? 1 : -1));
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getProfile(userId);
                console.log('Fetched Profile:', profileData);
                setProfile(profileData);

                // Check if the current user is following this profile
                if (profileData.followers.includes(currentUser.id)) {
                    setIsFollowing(true);  // User is already following
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const userPosts = await fetchPosts(userId);
                console.log('Fetched Posts:', userPosts);
                setPosts(userPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchUserPosts();
    }, [userId]);

   const handleFollow = async () => {
    setLoading(true); // Show loading spinner while waiting for response
    try {
       if(isFollowing) {
            // Unfollow user
            await unfollowUser({ currentUsername: currentUser.id, usernameToFollow: userId });
            setIsFollowing(false);  // Set following state to false
            setProfile(prevProfile => ({
                ...prevProfile,
                followers: prevProfile.followers - 1  // Decrease followers by 1
            }));
        } else {
            // Follow user
            await followUser({ usernameToFollow: userId, currentUsername: currentUser.id });
            setIsFollowing(true);  // Set following state to true
            setProfile(prevProfile => ({
                ...prevProfile,
                followers: prevProfile.followers + 1  // Increase followers by 1
            }));
        }
    } catch (error) {
        console.error('Error following/unfollowing user:', error);
    }
    setLoading(false); // Hide loading spinner after response
};


    return (
        <div className="min-h-screen bg-gray-100 p-8 flex">
            <div className="fixed top-0 left-0 w-[3%] h-full z-20">
                <Lilmenu />
            </div>
            {/* Fixed Profile Information */}
            <Card className="fixed top-8 left-20 w-80 h-[28rem] p-6 space-y-6 z-10">
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32 relative overflow-hidden rounded-full transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-3 hover:shadow-xl hover:shadow-gray-500/50">
                        <AvatarImage src={profile.profilePic} alt={profile.username || "Profile Picture"} className="w-full h-full object-cover" />
                        <AvatarFallback className="bg-gray-800 text-white w-full h-full flex items-center justify-center font-bold">
                            {profile.username ? profile.username.split(' ').map(n => n[0]).join('') : 'N/A'}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-800">{profile.username || "Name"}</h3>
                    </div>
                </div>
                <p className="text-center">{profile.bio || "Bio not available"}</p>
                <div className="flex justify-center space-x-4">
                    <div className="text-center">
                        <p className="font-bold">{profile.followers.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">{profile.following.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                </div>
                
                {/* Conditionally Render Edit or Follow Button */}
                {currentUser && currentUser.name === username ? (
                    <Button className="w-full bg-gradient-to-r from-slate-950 via-gray-800 to-slate-950 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-900 hover:to-gray-700 hover:scale-105 hover:text-gray-100 transition-all duration-300 ease-in-out hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] relative overflow-hidden">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-500"></span>
                        Edit Profile
                    </Button>
                ) : (
                    <Button onClick={handleFollow} className="w-full bg-gradient-to-r from-slate-950 via-gray-800 to-slate-950 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-900 hover:to-gray-700 hover:scale-105 hover:text-gray-100 transition-all duration-300 ease-in-out hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] relative overflow-hidden">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-500"></span>
                        {isFollowing ? (
                            loading ? 'UnFollowing...' : "Follwing"
                        ):(
                            loading ? "Following...":"Follow"
                        )}
                    </Button>
                )}
            </Card>

            {/* Posts Grid */}
            <div className="ml-96 flex-1">
                <div className="grid grid-cols-3 gap-4">
                    {posts.map((post) => (
                        <Dialog key={post.id}>
                            <DialogTrigger asChild>
                                <Card className="group relative cursor-pointer overflow-hidden">
                                    <CardContent className="p-0">
                                        <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="text-white text-center">
                                                <p className="font-bold">{post.likes} likes</p>
                                                <p>{post.comments} comments</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] text-white">
                                <div className="space-y-4">
                                    <img src={post.image} alt={post.caption} className="w-full h-96 object-cover rounded-lg" />
                                    <p className="text-center font-medium">{post.caption}</p>
                                    <div className="flex justify-between items-center">
                                        <Button variant="ghost" size="sm" onClick={handleLike}>
                                            <Heart className="w-5 h-5 mr-2" />
                                            {post.likes} likes
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <MessageCircle className="w-5 h-5 mr-2" />
                                            {post.comments} comments
                                        </Button>
                                    </div>
                                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                        {/* Mock comments - replace with actual comments data */}
                                        {Array.from({ length: post.comments }).map((_, i) => (
                                            <div key={i} className="mb-4">
                                                <p className="font-semibold">User {i + 1}</p>
                                                <p className="text-sm text-muted-foreground">Great post!</p>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoolProfilePage;
