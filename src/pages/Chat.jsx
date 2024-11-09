import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { ScrollArea } from "../components/ui/scroll-area"
import { Smile, Send, Settings } from "lucide-react"
import EmojiPicker from 'emoji-picker-react'
import image1 from "../../public/images/3.png"
import image2 from "../../public/images/4.png"
import image3 from "../../public/images/5.png"
import Lilmenu from "../component/lilmenubar"
import { io } from 'socket.io-client'
import InnerComponent from '@/component/chatComponent'
import axios from 'axios'
import { serverapi } from '@/data/server'
import Chatindex from '@/component/chatindex'


const mockChats = [
  { id: 1, name: 'John Doe', profilePic: image1, lastMessage: 'Hey there!' },
  { id: 2, name: 'Jane Smith', profilePic: image2, lastMessage: 'See you tomorrow!' },
  { id: 3, name: 'Michael Johnson', profilePic: image3, lastMessage: 'How are you?' },
  
  // Add more mock chats here if needed
]

const socket = io('http://localhost:8000')

const initialChatData = {
  1: [
    { id: 1, text: "Hey! What's up?", sender: "John Doe" },
    { id: 2, text: "Not much, working on a project.", sender: "You" },
  ],
  2: [
    { id: 1, text: "Hello Jane!", sender: "You" },
    { id: 2, text: "Hi! How are you?", sender: "Jane Smith" },
  ],
  3: [
    { id: 1, text: "Hey Michael!", sender: "You" },
    { id: 2, text: "How are you?", sender: "Michael Johnson" },
  ],
}

const initialBackgroundSettings = {
  "1": { bgColor: '#f0f4f8', bgImage: '' },
  "2": { bgColor: '#f0f4f8', bgImage: '' },
  "3": { bgColor: '#f0f4f8', bgImage: '' },
}

export default function ChatComponent() {
  const [index,setindex] = useState(true);
  const [selectedChat, setSelectedChat] = useState({_id:"1",username:"",profilePic:""})
  const [userFollow,setUserFollow] = useState([{_id:"1",username:"",profilePic:""}]);
  const [chatData, setChatData] = useState(initialChatData)
  const [draftMessages, setDraftMessages] = useState({})
  const [newMessage, setNewMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const [backgroundSettings, setBackgroundSettings] = useState(initialBackgroundSettings)

  

  const emojiPickerRef = useRef(null)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(()=>{
    const getdata = async()=>{
        try {
          const resp = await axios.get(`${serverapi}/api/chat/getUsersfollow`,{withCredentials:true});
          // console.log(resp.data);
          setUserFollow(resp.data);
          

        } catch (error) {
          console.error(error);
        }
    }
    getdata();
  },[])

  useEffect(() =>{
    console.log('user at chat',user)
    socket.emit('join',user.id)
  },[])

  useEffect(() => {
    setNewMessage(draftMessages[selectedChat._id] || '')
  }, [selectedChat, draftMessages])

  useEffect(() => {
    // Scroll to the bottom of the chat messages when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatData, selectedChat])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const updatedMessages = [...chatData[selectedChat._id], { id: Date.now(), text: newMessage, sender: 'You' }]
      setChatData({ ...chatData, [selectedChat._id]: updatedMessages })
      setNewMessage('')
      setDraftMessages({ ...draftMessages, [selectedChat._id]: '' })
    }
  }

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.emoji)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
    setDraftMessages({ ...draftMessages, [selectedChat._id]: e.target.value })
  }

  const handleselect = (chat) => {
    console.log("clicked")
    setSelectedChat(chat);
    setindex(false)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  const handleBgColorChange = (color) => {
    setBackgroundSettings({
      ...backgroundSettings,
      [selectedChat._id]: { ...backgroundSettings[selectedChat._id], bgColor: color, bgImage: '' },
    })
  }

  const handleBgImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBackgroundSettings({
          ...backgroundSettings,
          [selectedChat._id]: { ...backgroundSettings[selectedChat._id], bgImage: reader.result, bgColor: '' },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="">
      {/* Left Sidebar: List of chats */}
      <div className="fixed top-0 left-0 w-[3%] h-full z-20">
                <Lilmenu  />
       </div>
       <div className='max-h-screen flex ml-16'>
      <div className="w-1/3  border-r bg-gray-100 p-4 h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>
        <ScrollArea className="h-[calc(100vh-100px)]">
          {userFollow.map(chat => (
            <div
              key={chat._id}
              className={`flex items-center p-3 mb-2 cursor-pointer rounded-lg transition-all transform hover:scale-105 ${
                selectedChat._id === chat._id ? 'bg-blue-100' : 'hover:bg-gray-200'
              }`}
              onClick={() => {handleselect(chat);}} 
            >
              <Avatar className="w-12 h-12 mr-4 ml-4 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-3 hover:shadow-xl hover:shadow-blue-500/50">
                <AvatarImage src={chat.profilePic} alt={chat.username} />
                <AvatarFallback>{chat.username}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">{chat.username}</h3>
                {/* <p className="text-sm text-gray-500">{chat.lastMessage}</p> */}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

    {
      !index?   <InnerComponent 
      selectedChat={selectedChat} 
      socket={socket}
      backgroundSettings={backgroundSettings} 
      handleBgImageChange={handleBgImageChange}
      handleBgColorChange={handleBgColorChange}
    /> : <Chatindex/>
    }
      {/* Right Side: Chat Interface */}
      {/* <div className="w-2/3 flex flex-col">
        <div className="border-b bg-gray-100 p-4 flex items-center space-x-4 justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-10 h-10 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-3 hover:shadow-xl hover:shadow-blue-500/50">
              <AvatarImage src={selectedChat.profilePic} alt={selectedChat.name} />
              <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="font-bold text-lg text-gray-700">{selectedChat.name}</h2>
          </div>

          <button
            className="focus:outline-none hover:scale-110 transition-transform"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <ScrollArea
          className="flex-1 p-4 space-y-4 overflow-y-auto"
          style={{
            backgroundColor: backgroundSettings[selectedChat.id]?.bgColor || 'transparent',
            backgroundImage: backgroundSettings[selectedChat.id]?.bgImage ? `url(${backgroundSettings[selectedChat.id].bgImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {chatData[selectedChat.id].map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'You' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs transition-colors duration-300 ${
                  message.sender === 'You' ? 'bg-blue-500 text-white my-2' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> 
        </ScrollArea>

        <div className="border-t bg-white p-4 flex items-center space-x-2 relative">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="focus:outline-none">
            <Smile className="w-6 h-6 text-gray-600" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-16" ref={emojiPickerRef}>
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}

          <Input
            className="flex-1"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />

          <Button onClick={handleSendMessage} className="bg-blue-500 text-white hover:bg-blue-600">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Customize Chat Background for {selectedChat.name}</h3>

            <label className="block mb-2 text-gray-700">Choose Background Color</label>
            <input
              type="color"
              value={backgroundSettings[selectedChat.id]?.bgColor || '#f0f4f8'}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="w-full h-10 mb-4 cursor-pointer"
            />

            <label className="block mb-2 text-gray-700">Upload Background Image</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleBgImageChange}
              className="w-full h-10 mb-4 cursor-pointer"
            />

            <div className="flex justify-end space-x-2">
              <Button onClick={() => setShowSettings(false)} className="bg-gray-400 text-white hover:bg-gray-500">
                Cancel
              </Button>
              <Button onClick={() => setShowSettings(false)} className="bg-blue-500 text-white hover:bg-blue-600">
                Save
              </Button>
            </div>
          </div>
        </div>
      )} */}
      </div>
    </div>
  )
}
