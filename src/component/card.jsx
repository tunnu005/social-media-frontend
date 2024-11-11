import React, { useState,useCallback } from "react"
import { Heart, MessageCircle, Share2, ChevronDown, ChevronUp, Send } from "lucide-react"
import { serverapi } from "@/data/server";
import { addComment, addlike } from "@/services/postServices";

function debounce(func, delay) {
  let timeout;
  return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
  };
}

export default function SocialCard({
  postId,
  profilePicture,
  username,
  postImage,
  caption,
  initialLikes,
  initialComments,
  likedby,
  onLike = () => { },
  onComment = () => { },
  onShare = () => { }
}) {
  const [liked, setLiked] = useState(likedby)
  const [likes, setLikes] = useState(initialLikes)
  const [expanded, setExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")


  const debouncedLikeDislike = useCallback(debounce((newLiked) => {
    const repsonse = addlike({postId,liked:newLiked})
    
  }, 300), []);

  const handleLike = () => {
    const newLikedState = !liked
    setLiked(newLikedState)
    setLikes(likes + (newLikedState ? 1 : -1))
    onLike(newLikedState)


    debouncedLikeDislike(newLikedState);
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      const comment = { id: comments.length + 1, user: username, text: newComment.trim() }
      setComments([...comments, comment])
      setNewComment("")
      onComment(comment.text)
      addComment({postId,text:newComment})
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        <img
          className="w-full h-64 sm:h-[28rem] object-cover"
          src={postImage}
          alt="Post content"
        />
        <div className="absolute top-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center">
            <img
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full mr-2 sm:mr-4 border-2 border-white transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-3 hover:shadow-xl hover:shadow-gray-500/50"
              src={profilePicture}
              alt={`${username}'s profile`}
            />
            <div className="text-xs sm:text-sm">
              <p className="text-white font-semibold">{username}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-xs sm:text-sm line-clamp-2">
            {caption}
          </p>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <button
            className={`flex items-center space-x-1 sm:space-x-2 ${liked ? "text-red-500" : "text-gray-500"
              } hover:text-red-500 transition-colors duration-200`}
            onClick={handleLike}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${liked ? "fill-current" : ""}`} />
            <span className="text-xs sm:text-sm">{likes} {likes === 1 ? "Like" : "Likes"}</span>
          </button>
          <button
            className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
            onClick={() => setShowComments(!showComments)}
            aria-label={showComments ? "Hide comments" : "Show comments"}
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm">{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</span>
          </button>
          <button
            className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-green-500 transition-colors duration-200"
            onClick={onShare}
            aria-label="Share"
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm">Share</span>
          </button>
        </div>
        <div>
          <button
            className="text-blue-500 text-xs sm:text-sm font-medium flex items-center"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="caption-expanded"
          >
            {expanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </>
            ) : (
              <>
                <span>Read more</span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </>
            )}
          </button>
          {expanded && (
            <div id="caption-expanded" className="mt-2 text-gray-700 text-xs sm:text-sm max-h-32 sm:max-h-40 overflow-y-auto">
              {caption}
            </div>
          )}
        </div>
        {showComments && (
          <div className="mt-3 sm:mt-4">
            <h3 className="font-semibold text-base sm:text-lg mb-2">Comments</h3>
            <div className="space-y-2 mb-3 sm:mb-4 max-h-32 sm:max-h-40 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-100 p-2 rounded">
                  <p className="font-medium text-xs sm:text-sm">{comment.user}</p>
                  <p className="text-xs sm:text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddComment} className="flex items-center">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow p-2 text-xs sm:text-sm border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Send comment"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}