import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Bookmark } from 'lucide-react'
import image1 from '../../public/images/7.png'
import image2 from '../../public/images/8.png'
import image3 from '../../public/images/9.png'
import image4 from '../../public/images/10.png'
import image5 from '../../public/images/11.png'
import image6 from '../../public/images/12.png'



const categories = ['Trending', 'Favorite', 'Similar', 'Most Liked']
const filterCategories = ['All', 'Funny', 'Education', 'Fashion', 'Others']

const PostSlider = ({ posts }) => {
  const [currentCategory, setCurrentCategory] = useState(0)
  const [currentPost, setCurrentPost] = useState(0)

  const nextPost = () => {
    setCurrentPost((prev) => (prev + 1) % posts.length)
  }

  const prevPost = () => {
    setCurrentPost((prev) => (prev - 1 + posts.length) % posts.length)
  }

  const nextCategory = () => {
    setCurrentCategory((prev) => (prev + 1) % categories.length)
  }

  const prevCategory = () => {
    setCurrentCategory((prev) => (prev - 1 + categories.length) % categories.length)
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{categories[currentCategory]}</h2>
        <div className="flex space-x-2">
          <button onClick={prevCategory} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextCategory} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="relative ">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentPost * 100}%)` }}>
            {posts.map((post) => (
              <div key={post.id} className="w-full flex-shrink-0 justify-center items-center">
                <div className='flex justify-center items-center'>
                <img src={post.image} alt={post.title} className="w-96 h-96 object-cover rounded-lg" />
               
                </div>
                <h3 className="mt-2 text-lg font-semibold flex justify-center items-center">{post.title}</h3>
               
              </div>
            ))}
          </div>
        </div>
        <button onClick={prevPost} className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextPost} className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

const Filter = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filterCategories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveFilter(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === category
              ? 'bg-primary text-primary-foreground'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

const RandomPost = ({ post }) => {
  const [isVisible, setIsVisible] = useState(false)
  const postRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(postRef.current)
        }
      },
      { threshold: 0.1 }
    )

    if (postRef.current) {
      observer.observe(postRef.current)
    }

    return () => {
      if (postRef.current) {
        observer.unobserve(postRef.current)
      }
    }
  }, [])

  return (
    <div ref={postRef} className={`bg-white rounded-lg shadow-md overflow-hidden transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {isVisible ? (
        <>
          <img src={post.image} alt={post.title} className="w-80 h-80 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{post.category}</p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="text-gray-600 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="text-gray-600 hover:text-blue-500">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
              <button className="text-gray-600 hover:text-yellow-500">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
      )}
    </div>
  )
}

const RandomPosts = ({ posts, activeFilter }) => {
  const filteredPosts = activeFilter === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeFilter)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredPosts.map((post) => (
        <RandomPost key={post.id} post={post} />
      ))}
    </div>
  )
}

export default function Explore() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    // Simulating API call to fetch posts
    setTimeout(() => {
      setPosts([
        { id: 1, title: 'Exploring Nature', image: image1, category: 'Others' },
        { id: 2, title: 'City Lights', image: image2, category: 'Others' },
        { id: 3, title: 'Mountain Adventures', image: image3, category: 'Others' },
        { id: 4, title: 'Beach Sunset', image: image4, category: 'Others' },
        { id: 5, title: 'Food Delights', image: image5, category: 'Funny' },
        { id: 6, title: 'Art Gallery', image: image6, category: 'Education' },
        { id: 7, title: 'Tech Innovations', image: image1, category: 'Education' },
        { id: 8, title: 'Fashion Trends', image: image2, category: 'Fashion' },
        { id: 9, title: 'Funny Cats', image: image3, category: 'Funny' },
        { id: 10, title: 'DIY Projects', image: image6, category: 'Education' },
        { id: 11, title: 'Street Style', image: image4, category: 'Fashion' },
        { id: 12, title: 'Meme of the Day', image: image5, category: 'Funny' },
      ])
      setLoading(false)
    }, 1500)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <PostSlider posts={posts} />
          <Filter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          <RandomPosts posts={posts} activeFilter={activeFilter} />
        </>
      )}
    </div>
  )
}