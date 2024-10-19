'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaComments, FaHeart, FaPlus, FaSearch, FaUser } from 'react-icons/fa';

const flags = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png',
  'https://cdn.britannica.com/79/5779-050-46C999AF/Flag-Saudi-Arabia.jpg'
];

const NavBar = ({ togglePopup }) => {
  const [flagIndex, setFlagIndex] = useState(0);

  const HandleFlagPress = () => {
    setFlagIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
  }

  const HandleProfilePress = () => {
    togglePopup(1);
  }

  return (
    <header>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between h-auto">
            <section className="flex items-center justify-between w-full md:w-auto">
              <div className="flex items-center">
                <Link href="/home">
                  <img className="h-8 md:h-12" src="/Resources/logo.jpg" alt="Logo" />
                </Link>
              </div>
              <div className="flex md:hidden items-center space-x-4">
                <Link href="/chats" className="text-gray-700 p-2 rounded-md hover:bg-gray-200">
                  <FaComments />
                </Link>
                <Link href="/favourites" className="text-gray-700 p-2 rounded-md hover:bg-gray-200">
                  <FaHeart />
                </Link>
                <button onClick={HandleProfilePress} className="text-gray-700 p-2 rounded-md hover:bg-gray-200">
                  <FaUser />
                </button>
                <button className="text-white p-3 rounded-md bg-yellow-400 hover:bg-yellow-500" title='place item for sale'>
                  <FaPlus size={20} />
                </button>
              </div>
              <div className="flex md:hidden items-center">
                <button onClick={HandleFlagPress} className="text-gray-700 p-2 rounded-md hover:bg-gray-200">
                  <img src={flags[flagIndex]} className="h-8 md:h-12 w-12 md:w-auto" />
                </button>
              </div>
            </section>
            <div className="flex-1 flex items-center justify-center p-4 w-full md:w-auto">
              <a className="w-full flex focus-within:outline rounded-md outline-2">
                <input
                  type="text"
                  className="w-full py-2 px-4 border rounded-l-md text-black focus:outline-none"
                  placeholder="Search for products..."
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-r-md focus:outline-none">
                  <p className="hidden sm:block">Search</p>
                  <FaSearch className="block sm:hidden" />
                </button>
              </a>
            </div>
            <section className="hidden md:flex items-center space-x-4 md:w-auto justify-center md:justify-start">
              <Link href="/chats" className="text-gray-700 p-2 rounded-md hover:bg-gray-200" title='chats'>
                <FaComments />
              </Link>
              <Link href="/favourites" className="text-gray-700 p-2 rounded-md hover:bg-gray-200" title='favourites'>
                <FaHeart />
              </Link>
              <button onClick={HandleProfilePress} className="text-gray-700 p-2 rounded-md hover:bg-gray-200" title='profile'>
                <FaUser />
              </button>
              <button className="text-white p-3 rounded-md bg-yellow-400 hover:bg-yellow-500" title='place item for sale'>
                <FaPlus size={20} />
              </button>
              <button onClick={HandleFlagPress} className="text-gray-700 p-2 rounded-md hover:bg-gray-200">
                <img src={flags[flagIndex]} className="w-12 h-8" />
              </button>
            </section>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
