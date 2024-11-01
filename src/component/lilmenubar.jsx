import React, { useState, useEffect } from 'react';
import { Home, Search, Compass, PlusCircle, Bell, X, MessageCircleMore, Swords,SearchIcon, Menu } from 'lucide-react';
import { serverapi } from '@/data/server';
import UserCard from './Usercard';
import axios from 'axios';

export default function ResponsiveVerticalMenu() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  const handleSearch = async (e) => {

    const term = e.target.value;
    console.log(term);
    setSearchTerm(term);

    if (term.trim() === '') {
      setUsers([]);
      return;
    }

    try {
      const response = await axios.get(`${serverapi}/api/users/search`, { params: { term } });
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    // Optionally, you can debounce the search
    const debounceTimeout = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch({ target: { value: searchTerm } });
      }
    }, 300); // Adjust debounce delay as needed
    console.log(searchTerm)
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', onClick: toggleDrawer },
    { icon: Compass, label: 'Explore', href: '/explore' },
    { icon: MessageCircleMore, label: 'Chats', href: '/chat' },
    { icon: PlusCircle, label: 'Create', href: '/create' },
    { icon: Bell, label: 'Notifications', href: '#' },
  ];

  const renderMenuItems = (showLabels = false) => (
    <nav className={`space-y-6 ${showLabels ? 'flex flex-col items-start' : ''}`}>
      {menuItems.map((item, index) => (
        <React.Fragment key={item.label}>
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="flex items-center space-x-3 text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 w-full"
            >
              <item.icon className="h-6 w-6" />
              {showLabels && <span>{item.label}</span>}
            </button>
          ) : (
            <a
              href={item.href}
              className="flex items-center space-x-3 text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 w-full"
            >
              <item.icon className="h-6 w-6" />
              {showLabels && <span>{item.label}</span>}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-screen bg-gray-100 p-4 z-40 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'w-64' : 'w-20'} md:w-20 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* App Name */}
        <div className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent hover:from-blue-400 hover:via-green-500 hover:to-yellow-500 transition-all duration-500 ease-in-out hover:scale-110">
          <Swords className="h-6 w-6 mx-auto" />
        </div>

        {/* Menu Items */}
        {renderMenuItems(isMobileMenuOpen)}
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full md:w-[28rem] bg-gray-200 shadow-lg z-50 transform ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
          onClick={toggleDrawer}
          aria-label="Close search drawer"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Search Section */}
        <div className="p-6 mt-16">
          <h2 className="text-2xl font-bold text-black mb-4">Search</h2>

          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              onFocus={handleFocus}
              onBlur={handleBlur}
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
                onClick={() => document.querySelector('input').value = ''}
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-900 my-4"></div>

        {/* Search Results */}
        <div className="p-6">
          {/* <p className="text-black">Results will be displayed here...</p> */}
          {users.length > 0 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold">Results:</h3>
            <ul className="mt-2">
              {users.map(user => (
                  <UserCard user={user}/>
              ))}
            </ul>
          </div>
        )}
        </div>
      </div>

      {/* Overlay to close drawer and mobile menu when clicking outside */}
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