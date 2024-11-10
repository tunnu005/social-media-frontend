import React, { useContext, useEffect, useState } from 'react';
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

const ChatFull = ({ socket }) => {
  return (
    <div className="max-h-screen w-full flex">
      <InnerComponent socket={socket} />
    </div>
  );
};

function App() {
  const { isAuthenticated, User } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (User && socket) {
      console.log('user at chat', User);
      socket.emit('join', User._id);
    }
  }, [User, socket]);

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
          <Route path="/chat/:userId" element={socket ? <ChatFull socket={socket} /> : null} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
