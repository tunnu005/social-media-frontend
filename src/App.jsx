import React, { useContext, useEffect, useState,useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Auth from './component/Auth';
import Index from './pages/Index';
import Chat from './pages/Chat';
import Create from './pages/Create';
import Explore from './pages/Explore';
import AuthContext from './utilitis/authContextprovider';
import AuthenticatedLayout from './utilitis/authlayout';
import InnerComponent from './component/chatComponent';
import { io } from 'socket.io-client';

const ChatFull = () => {
  const { User } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection only once when component mounts
    if (User && !socketRef.current) {
      const newSocket = io('wss://social-media-backend-1w5q.onrender.com', {
        transports: ['websocket', 'polling']
    });
    
      socketRef.current = newSocket;
      setSocket(newSocket);

      // Join room with User ID
      newSocket.emit('join', User._id);

      // Cleanup on component unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [User]);

  return (
    <div className="max-h-screen w-full flex">
      <InnerComponent socket={socketRef.current} />
    </div>
  );
};
function App() {
  const { isAuthenticated } = useContext(AuthContext);
 

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Index />} />
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/home" /> : <Auth />} />
        
        {/* Protected Routes */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile/:userId/:username" element={<Profile />} />
          <Route path="/create" element={<Create />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/chat/:userId" element={<ChatFull  />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
