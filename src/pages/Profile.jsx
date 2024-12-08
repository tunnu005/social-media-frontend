import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { ScrollArea } from "../components/ui/scroll-area";
import { Heart, MessageCircle } from "lucide-react";
import VerticalMenu from '../component/menubar';
import { useNavigate, useParams } from 'react-router-dom';
import { followUser, getProfile, unfollowUser } from '@/services/userServices';
import { getUser } from '@/services/userServices';
import { fetchPosts } from '@/services/postServices';

const CoolProfilePage = () => {
    const [selectedPost, setSelectedPost] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [profile, setProfile] = useState({ username: '', bio: '', followers: 0, following: 0 });
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const { userId, username } = useParams();
    const [userProfile, setUserProfile] = useState({});
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const handleLike = () => {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikes(likes + (newLikedState ? 1 : -1));
    };

    useEffect(() => {
        // Set loading true before fetching
        const fetchProfile = async () => {
            //   setuserloading(true)
            try {
                const profile = await getUser();
                // console.log('Profile loaded', profile)
                setUserProfile(profile);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
            //   setuserloading(false);
        };
        fetchProfile();
        // Set loading false after fetching
    }, []);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getProfile(userId);
                setProfile(profileData);
                if (profileData.followers.includes(currentUser.id)) {
                    setIsFollowing(true);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [userId]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const userPosts = await fetchPosts(userId);
                setPosts(userPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchUserPosts();
    }, [userId]);

    const handleFollow = async () => {
        setLoading(true);
        try {
            if (isFollowing) {
                await unfollowUser({ currentUsername: currentUser.id, usernameToFollow: userId });
                setIsFollowing(false);
                setProfile(prevProfile => ({
                    ...prevProfile,
                    followers: prevProfile.followers - 1
                }));
            } else {
                await followUser({ usernameToFollow: userId, currentUsername: currentUser.id });
                setIsFollowing(true);
                setProfile(prevProfile => ({
                    ...prevProfile,
                    followers: prevProfile.followers + 1
                }));
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:fixed top-0 left-0 w-full md:w-[3%] md:h-full z-20 mb-4 md:mb-0 lg:hidden">
                <VerticalMenu user={userProfile} />
            </div>

            {/* Profile Information */}
            <Card className="md:fixed top-8 left-20 w-full md:w-80 h-auto md:h-[28rem] p-6 space-y-6 z-10 mb-4 md:mb-0">
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32 relative overflow-hidden rounded-full transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-3 hover:shadow-xl hover:shadow-gray-500/50">
                        <AvatarImage src={profile.profilePic} alt={profile.username || "Profile Picture"} />
                        <AvatarFallback className="bg-gray-800 text-white w-full h-full flex items-center justify-center font-bold">
                            {profile.username ? profile.username.slice(0, 2).toUpperCase() : 'N/A'}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">{profile.username || "Name"}</h3>
                    </div>
                </div>
                <p className="text-center text-sm md:text-base">{profile.bio || "Bio not available"}</p>
                <div className="flex justify-center space-x-4">
                    <div className="text-center">
                        <p className="font-bold">{profile.followers.length || 0}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">{profile.following.length || 0}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">Following</p>
                    </div>
                </div>

                {/* Follow Button */}
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
                        ) : (
                            loading ? "Following..." : "Follow"
                        )}
                    </Button>
                )}
            </Card>

            {/* Posts Grid */}
            <div className="w-full md:ml-96 flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {posts.map((post) => (
                        <Dialog key={post.id}>
                            <DialogTrigger asChild>
                                <Card className="group relative cursor-pointer overflow-hidden">
                                    <CardContent className="p-0">
                                        <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="text-white text-center">
                                                <p className="font-bold">{post.likes} likes</p>
                                                <p> comments</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] text-white">
                                <div className="space-y-4">
                                    <img src={post.image} alt={post.caption} className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg" />
                                    <p className="text-center font-medium">{post.caption}</p>
                                    <div className="flex justify-between items-center">
                                        <Button variant="ghost" size="sm" onClick={handleLike}>
                                            <Heart className="w-5 h-5 mr-2" />
                                            {post.likes} likes
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <MessageCircle className="w-5 h-5 mr-2" />
                                            {post.comments.length} comments
                                        </Button>
                                    </div>
                                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                        {Array.from({ length: 5 }).map((_, i) => (
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
