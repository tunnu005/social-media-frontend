import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import axios from 'axios';
import { serverapi } from '@/data/server'; // Adjust the path if necessary

const SearchDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSearch = async (e) => {

    const term = e.target.value;
    // console.log(term);
    setSearchTerm(term);

    if (term.trim() === '') {
      setUsers([]);
      return;
    }

    try {
      const response = await axios.get(`${serverapi}/api/users/search`, { params: { term } });
      // console.log(response.data);
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
    // console.log(searchTerm)
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    <>
      {/* Search Button */}
      <button
        className="fixed top-4 left-4 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
        onClick={toggleDrawer}
      >
        <Search className="w-6 h-6" />
      </button>

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
          onClick={toggleDrawer}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <div className="p-6 mt-12">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            onClick={() => handleSearch({ target: { value: searchTerm } })}
          >
            Search
          </button>
        </div>

        {/* Display search results */}
        {users.length > 0 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold">Results:</h3>
            <ul className="mt-2">
              {users.map(user => (
                <li key={user._id} className="py-2 border-b border-gray-200">
                  {user.username}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Overlay to close drawer when clicking outside */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40"
          onClick={toggleDrawer}
        ></div>
      )}
    </>
  );
};

export default SearchDrawer;
