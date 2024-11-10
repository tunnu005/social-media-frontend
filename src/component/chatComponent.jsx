import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { ScrollArea } from "../components/ui/scroll-area"
import { Smile, Send, Settings } from "lucide-react"
import EmojiPicker from 'emoji-picker-react'
import { serverapi } from '@/data/server'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { getProfile } from '@/services/userServices'

const InnerComponent = ({ socket }) => {
    const initialData = [
        {  message: "Hey! What's up?", senderId: "John Doe" },
        {  message: "Not much, working on a project.", senderId: "You" },
    ]
    const [selectedChat, setSelectedChat] = useState({_id:"1",username:"",profilePic:""})

    const {userId} = useParams()

    // console.log("selectedChat : ",userId)
    const initialBackgroundSettings = {
        "1": { bgColor: '#f0f4f8', bgImage: '' },
        "2": { bgColor: '#f0f4f8', bgImage: '' },
        "3": { bgColor: '#f0f4f8', bgImage: '' },
      }
      const [backgroundSettings, setBackgroundSettings] = useState(initialBackgroundSettings)

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

      const handleBgColorChange = (color) => {
        setBackgroundSettings({
          ...backgroundSettings,
          [selectedChat._id]: { ...backgroundSettings[selectedChat._id], bgColor: color, bgImage: '' },
        })
      }
    
    const [chatData, setChatData] = useState([ {message: "Hey! What's up?", senderId: "John Doe" },])
    const user = JSON.parse(localStorage.getItem('user')) 
    const [loading,setloading] = useState(false);

    // console.log("background : ",backgroundSettings)
    // console.log("senderId",user.id)
    // console.log("selectedChat : ",selectedChat._id)

    useEffect(()=>{
           const getreciever = async() =>{
            const respo = await getProfile(userId);
            // console.log("data reciver: ",respo)
            setSelectedChat(respo)
           }
           getreciever();
    },[])
    const getmessage = async()=>{
        setloading(true);
        const respo = await axios.get(`${serverapi}/api/chat/getMessages/${user.id}/${userId}`)
        // console.log("data : ",respo.data)
        setChatData(respo.data)
        setloading(false);
    }
    useEffect(()=>{

        getmessage();
        setChatData(initialData);

        socket.on('receive-message',(data)=>{
            // console.log('Received message',data)
            // const dataobjetc
            setChatData(prevData => [...prevData, data])
        });

        return () => {
            socket.off('receive-message');
        };
    },[selectedChat])
    
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [draftMessages, setDraftMessages] = useState({})

    const emojiPickerRef = useRef(null)
    const fileInputRef = useRef(null)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        // Auto-scroll to the latest message
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [chatData])

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleEmojiSelect = (emoji) => {
        setNewMessage((prevMessage) => prevMessage + emoji.emoji)
    }

    const handleInputChange = (e) => {
        setNewMessage(e.target.value)
        setDraftMessages({ ...draftMessages, [selectedChat._id]: e.target.value })
    }

    const handleSendMessage = () => {
        // console.log('Sending message')
        if (newMessage.trim()) {
            
            // console.log('receiverId : ',selectedChat._id)
            socket.emit('private-message',{
                senderId: user.id,
                receiverId: selectedChat._id,
                message: newMessage
            })
            const newChatMessage = { message: newMessage, senderId: user.id }
            setChatData([...chatData, newChatMessage])
            setNewMessage('')
            setDraftMessages({ ...draftMessages, [selectedChat._id]: '' })
        }
    }

    return (
        <>
            {/* Right Side: Chat Interface */}
            <div className="w-full h-screen flex flex-col">
                {/* Chat Header with Settings Icon */}
                <div className="border-b bg-gray-100 p-4 flex items-center space-x-4 justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-10 h-10 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-3 hover:shadow-xl hover:shadow-blue-500/50">
                            <AvatarImage src={selectedChat.profilePic} alt={selectedChat.username} />
                            <AvatarFallback>{selectedChat.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h2 className="font-bold text-lg text-gray-700">{selectedChat.username}</h2>
                    </div>

                    {/* Settings Icon */}
                    <button
                        className="focus:outline-none hover:scale-110 transition-transform"
                        onClick={() => setShowSettings(true)}
                    >
                        <Settings className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Chat Messages */}
                <ScrollArea
                    className="flex-1 p-4 space-y-4 overflow-y-auto"
                    style={{
                        backgroundColor: backgroundSettings[selectedChat._id]?.bgColor || 'bg-black',
                        backgroundImage: backgroundSettings[selectedChat._id]?.bgImage ? `url(${backgroundSettings[selectedChat._id].bgImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {
                        loading ? <div>
                            Loading Chats...
                        </div> : chatData.map((chat,index) => (
                        <div
                            key={index}
                            className={`flex ${chat.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`p-3 rounded-lg max-w-xs transition-colors duration-300 ${
                                    chat.senderId === user.id ? 'bg-blue-500 text-white my-2' : 'bg-gray-200 text-gray-800 my-2'
                                }`}
                            >
                                {chat.message}
                            </div>
                        </div>
                    ))}
                    
                    <div ref={messagesEndRef} /> {/* This empty div helps scroll to the bottom */}
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t bg-white p-4 flex items-center space-x-2 relative">
                    {/* Emoji Picker */}
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="focus:outline-none">
                        <Smile className="w-6 h-6 text-gray-600" />
                    </button>
                    {showEmojiPicker && (
                        <div className="absolute bottom-16" ref={emojiPickerRef}>
                            <EmojiPicker onEmojiClick={handleEmojiSelect} />
                        </div>
                    )}

                    {/* Input Box */}
                    <Input
                        className="flex-1"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                    />

                    {/* Send Button */}
                    <Button onClick={handleSendMessage} className="bg-blue-500 text-white hover:bg-blue-600">
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Customize Chat Background for {selectedChat.username}</h3>

                        {/* Color Picker */}
                        <label className="block mb-2 text-gray-700">Choose Background Color</label>
                        <input
                            type="color"
                            value={backgroundSettings[selectedChat._id]?.bgColor || '#f0f4f8'}
                            onChange={(e) => handleBgColorChange(e.target.value)}
                            className="w-full h-10 mb-4 cursor-pointer"
                        />

                        {/* Image Upload */}
                        <label className="block mb-2 text-gray-700">Upload Background Image</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={(e) => handleBgImageChange( e)}
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
            )}
        </>
    )
}

export default InnerComponent
