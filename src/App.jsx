import React, { useContext } from 'react';
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
