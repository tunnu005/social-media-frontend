import React, { useState, useRef, useEffect, useContext } from 'react'
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
import VerticalMenu from '../component/menubar';

import InnerComponent from '@/component/chatComponent'
import axios from 'axios'
import { serverapi } from '@/data/server'
import Chatindex from '@/component/chatindex'
import AuthContext from '@/utilitis/authContextprovider'
import { useNavigate } from 'react-router-dom'


const mockChats = [
  { id: 1, name: 'John Doe', profilePic: image1, lastMessage: 'Hey there!' },
  { id: 2, name: 'Jane Smith', profilePic: image2, lastMessage: 'See you tomorrow!' },
  { id: 3, name: 'Michael Johnson', profilePic: image3, lastMessage: 'How are you?' },
  
  // Add more mock chats here if needed
]


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
  const [selectedChat, setSelectedChat] = useState("")
  const [userFollow,setUserFollow] = useState([{_id:"1",username:"",profilePic:""}]);
  const [chatData, setChatData] = useState(initialChatData)
  const [draftMessages, setDraftMessages] = useState({})
  const [newMessage, setNewMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const [backgroundSettings, setBackgroundSettings] = useState(initialBackgroundSettings)
  const { User } = useContext(AuthContext)
   
  const navigator = useNavigate()

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

  // useEffect(() =>{
  //   console.log('user at chat',user)
  //   socket.emit('join',user.id)
  // },[])

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
    setSelectedChat(chat._id);
    setindex(false)
    navigator(`/chat/${chat._id}`)

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
      {/* <div className="md:fixed top-0 left-0 w-full md:w-[3%] md:h-full z-20 mb-4 md:mb-0 lg:hidden">
                <VerticalMenu user={User} />
            </div> */}
       <div className={`max-h-screen flex lg:ml-16 `}>
      <div className={`w-full  border-r bg-gray-100 p-4 h-screen overflow-y-auto ${!index?'hidden':''} lg:block`}>
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

     
          {/* <div className={`max-h-screen w-full flex  ${!index?'':'hidden'} lg:flex`}>
          {
            !index ? <InnerComponent
              selectedChat={selectedChat}
              socket={socket}
            
            /> : <Chatindex />
          }
          </div> */}
          
       
      
      </div>
    </div>
  )
}
