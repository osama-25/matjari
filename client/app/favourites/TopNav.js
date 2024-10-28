'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaComments, FaHeart, FaSearch, FaUser } from 'react-icons/fa';

const flags = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png',
  'https://cdn.britannica.com/79/5779-050-46C999AF/Flag-Saudi-Arabia.jpg'
];

const FavTopNav = () => {
  const [flagIndex, setFlagIndex] = useState(0);

  const HandleFlagPress = () => {
    setFlagIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
  }

  return (
    <header className="sticky top-0 z-50 h-10">
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
                <Link href="/chats" className="text-gray-700 p-2 rounded-md hover:bg-gray-300 hover:shadow-inner" title='chat'>
                  <FaComments />
                </Link>
                <button className="text-gray-500 p-2 rounded-md bg-gray-300 shadow-inner" title='favourites'>
                  <FaHeart />
                </button>
                <Link href="/profile" className="text-gray-700 p-2 rounded-md hover:bg-gray-300 hover:shadow-inner" title='profile'>
                  <FaUser />
                </Link>
              </div>
              <div className="flex md:hidden items-center">
                <button onClick={HandleFlagPress} className="text-gray-700 p-2 rounded-md hover:bg-gray-200">
                  <img src={flags[flagIndex]} className="h-8 md:h-12 w-12 md:w-auto" />
                </button>
              </div>
            </section>
            <section className="hidden md:flex items-center space-x-4 md:w-auto justify-center md:justify-start">
              <Link href="/chats" className="text-gray-700 p-2 rounded-md hover:bg-gray-300 hover:shadow-inner" title='chats'>
                <FaComments />
              </Link>
              <button className="text-gray-500 p-2 rounded-md bg-gray-300 shadow-inner" title='favourites'>
                <FaHeart />
              </button>
              <Link href="/profile" className="text-gray-700 p-2 rounded-md hover:bg-gray-300 hover:shadow-inner" title='profile'>
                <FaUser />
              </Link>
              <button onClick={HandleFlagPress} className="text-gray-700 p-2 rounded-md hover:bg-gray-200">
                <img src={flags[flagIndex]} className="w-12 h-8" />
              </button>
            </section>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default FavTopNav