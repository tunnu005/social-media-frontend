import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Auth from './component/Auth';
import Navbar from './component/Navbar';
import Chat from './pages/Chat';
import Create from './pages/Create';
import Explore from './pages/Explore';
import Cookies from 'js-cookie';

const CheckAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = Cookies.get('token');
    if (!auth) {
      navigate('/auth'); // Redirect to the Auth page if not authenticated
    }
  }, [navigate]);

  // If authenticated, return the Home component
  return <Home />;
}

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<CheckAuth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile/:userId/:username" element={<Profile />} />
        <Route path="/create" element={<Create />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </Router>
  );
}

export default App;
