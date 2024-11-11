import React, { useState, useEffect, useContext } from 'react';
import { Home, Search, Compass, PlusCircle, Bell, X, Search as SearchIcon, MessageCircle, Menu, LogOut } from 'lucide-react';
import axios from 'axios';
import { serverapi } from '@/data/server';
import UserCard from '@/component/Usercard';
import AuthContext from '@/utilitis/authContextprovider';
import { useNavigate } from 'react-router-dom';

export default function ResponsiveVerticalMenu({ user }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  const navigator = useNavigate();

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setUsers([]);
      return;
    }

    try {
      const response = await axios.get(`${serverapi}/api/users/search`, { params: { term } });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch({ target: { value: searchTerm } });
      }
    }, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const { setIsAuthenticated } = useContext(AuthContext);
  const handleSignout = async () => {
    try { 
      await axios.post(`${serverapi}/api/auth/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      navigator('/auth');
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Compass, label: 'Explore', href: '/Explore' },
    { icon: MessageCircle, label: 'Chats', href: '/Chat' },
    { icon: PlusCircle, label: 'Create', href: '/Create' },
    
  ];

  const topMenuItems = [
    { icon: Search, label: 'Search', onClick: toggleDrawer },
    { icon: Bell, label: 'Notifications', href: '#' },
    { icon: LogOut, label: 'Log Out', onClick: handleSignout },
  ];

  return (
    <>
      {/* Top Menu Bar (Mobile) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center z-50">
        {/* <button onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
          <Menu className="h-6 w-6" />
        </button> */}
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Buzzzy
        </div>
        <div className="flex space-x-4">
          {topMenuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick || (() => navigator(item.href))}
              aria-label={item.label}
            >
              <item.icon className="h-6 w-6" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex justify-around items-center z-50">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500"
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </a>
        ))}
         <a
           
            href={`/Profile/${user._id}/${user.username}`}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500"
          >
            
            <img src={user.profilePic} alt="profilepic" className='h-6 w-6 rounded-full'/>
            <span className="text-xs mt-1">profile</span>
          </a>
      </div>

      {/* Sidebar Menu (Desktop) */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen w-64 bg-gray-100 shadow-lg p-4 z-40">
        <div className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent hover:from-blue-400 hover:via-green-500 hover:to-yellow-500 transition-all duration-500 ease-in-out hover:scale-110">
          Vibely
        </div>
        <nav className="space-y-6">
          {[...menuItems, ...topMenuItems].map((item, index) => (
            <React.Fragment key={item.label}>
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="flex items-center space-x-3 text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 w-full"
                >
                  <item.icon className="h-6 w-6" />
                  <span className="relative transition-transform duration-300 group-hover:translate-x-2 group-hover:rotate-3">
                    {item.label}
                  </span>
                </button>
              ) : (
                <a
                  href={item.href}
                  className="flex items-center space-x-3 text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 relative group"
                >
                  <item.icon className="h-6 w-6" />
                  <span className="relative transition-transform duration-300 group-hover:translate-x-2 group-hover:rotate-3">
                    {item.label}
                  </span>
                </a>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Search Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full lg:w-[28rem] bg-gray-200 shadow-lg z-50 transform ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
          onClick={toggleDrawer}
          aria-label="Close search drawer"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
        <div className="p-6 mt-16">
          <h2 className="text-2xl font-bold text-black mb-4">Search</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 pl-12 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
            />
            {!isInputFocused && (
              <SearchIcon className="absolute left-5 top-3 h-4 text-gray-500" />
            )}
            {isInputFocused && (
              <button
                className="absolute left-3 top-3 text-gray-500"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-gray-900 my-4"></div>
        <div className="p-6">
          {users.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Results:</h3>
              <ul className="mt-2">
                {users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {(isDrawerOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => {
            setIsDrawerOpen(false);
            setIsMobileMenuOpen(false);
          }}
        ></div>
      )}
    </>
  );
}
