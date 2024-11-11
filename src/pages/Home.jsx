import React, { useEffect, useRef, useState } from 'react';
import InstagramCard from '../component/card';
import image1 from '../../public/images/1.png';
import ProfileCard from '../component/Profilecard';
import VerticalMenu from '../component/menubar';
import 'animate.css';
import { getUser } from '@/services/userServices';
import { gethomepost } from '@/services/postServices';

const Home = () => {
  const [ProfInfo, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [page, setPage] = useState(1); // Track the current page for pagination
  const [hasMorePosts, setHasMorePosts] = useState(true); // Track if there are more posts to load
  const observer = useRef(null);
  const [loading, setLoading] = useState(false); // Add loading state to prevent multiple fetches
  const loaderRef = useRef(null);
  const [userloading, setuserloading] = useState(true); // Add loading state to prevent multiple


  // Fetch user profile
  useEffect(() => {
    // Set loading true before fetching
    const fetchProfile = async () => {
      setuserloading(true)
      try {
        const profile = await getUser();
        // console.log('Profile loaded', profile)
        setProfile(profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
      setuserloading(false);
    };
    fetchProfile();
    // Set loading false after fetching
  }, []);

  // Fetch initial posts
  const fetchInitialPosts = async () => {
    try {
      setLoading(true); // Set loading true before fetching
      const initialPosts = await gethomepost({ page: 1, limit: 3 });
      // console.log('post', initialPosts)
      setPosts(initialPosts);
      setLoading(false); // Set loading false after fetching
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false); // Ensure loading stops on error
    }
  };

  useEffect(() => {
    fetchInitialPosts();
  }, []);

  // Handle infinite scroll
  const handleInfiniteScroll = async () => {
    const scrollableDiv = document.getElementById('scroll');
    if (
      scrollableDiv.scrollHeight - scrollableDiv.scrollTop <= scrollableDiv.clientHeight + 10 &&
      !loading &&
      hasMorePosts
    ) {
      loadMorePosts();
    }
  };

  // Fetch more posts when scrolled to the bottom
  const loadMorePosts = async () => {
    try {
      setLoading(true);
      const newPosts = await gethomepost({ page: page + 1, limit: 3 });

      if (newPosts.length === 0) {
        setHasMorePosts(false); // No more posts to load
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setPage((prevPage) => prevPage + 1);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading more posts:', error);
      setLoading(false);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const scrollableDiv = document.getElementById('scroll');
    scrollableDiv.addEventListener('scroll', handleInfiniteScroll);

    return () => scrollableDiv.removeEventListener('scroll', handleInfiniteScroll);
  }, [loading, hasMorePosts]);


  // Observer for post visibility animations
  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisiblePosts((prevVisiblePosts) => {
              if (!prevVisiblePosts.includes(index)) {
                return [...prevVisiblePosts, index];
              }
              return prevVisiblePosts;
            });
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the post is visible
      }
    );


    const elements = document.querySelectorAll('.post');
    elements.forEach((element) => observer.current.observe(element));

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [posts]);


  const Comments = [
    { id: 1, user: 'Mysterious_!Soul🌌', text: 'You’re killing it! Keep shining! 💪✨' },
    { id: 2, user: 'Coffee_@Sunrise🌅', text: 'So much talent! Proud of you! 👏🔥' },
    { id: 3, user: 'Nature_@Heart🌳', text: 'Absolutely gorgeous! 😍🌸' },
    { id: 4, user: 'Gamer!_Alex_92🎮', text: 'Can’t get enough of this! 💯🌈' },
    { id: 5, user: 'Flirty_@Heart💋', text: 'Stunning! You’ve got my heart racing! 💓🔥' }
  ];

  return (
    <div className="flex">
      {/* Fixed Vertical Menu */}
      <div className="fixed top-0 left-0 w-[15%] h-full z-20">
        <VerticalMenu user={ProfInfo} />
      </div>

      {/* Instagram Feed */}
      <div className="w-[65%] ml-[17%] h-screen pt-4 lg:mt-0 mt-12">
        <div
          className="justify-end h-screen"
          style={{
            overflowY: 'scroll',
            scrollbarWidth: 'none', // Hide scrollbar in Firefox
            msOverflowStyle: 'none', // Hide scrollbar in IE and Edge
          }}
          id="scroll"
        >
          {posts.map((post, index) => (
            <div
              className={`post my-3 ${visiblePosts.includes(index) ? 'animate__animated animate__fadeInBottomRight' : 'opacity-0'
                }`}
              data-index={index}
              key={index}
              style={{ transition: 'opacity 0.5s ease', animationDelay: `${index == 0 ? index * 0.2 : 0.2}s` }}
            >
              <InstagramCard
                postId={post._id}
                profilePicture={post.userId.profilePic}
                username={post.userId.username}
                postImage={post.image}
                caption={post.caption}
                initialLikes={post.likes}
                initialComments={Comments}
                likedby={post.likedByUser}
              />
            </div>
          ))}

          {loading && (
            <div className="loader">
              Loading more posts...
            </div>
          )}

          {!hasMorePosts && (
            <div className="no-more-posts">
              No more posts to load.
            </div>
          )}
        </div>
      </div>

      {/* Fixed Profile Card */}
      <div className="fixed top-0 right-0 w-[20%] mt-7 mr-12 hidden lg:block">
        <ProfileCard
          profilePicture={ProfInfo.profilePic || image1}
          username={ProfInfo.username || 'Default Username'}
          bio={ProfInfo.bio || 'Default Bio'}
          followers={ProfInfo.followers || 0}
          following={ProfInfo.following || 0}
          posts={ProfInfo.posts || 0}
          userId={ProfInfo._id || 0}
          loading={userloading}
        />
      </div>

    </div>
  );
};

export default Home;
