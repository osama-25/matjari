'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaComments, FaHeart, FaPlus, FaSearch, FaUser } from 'react-icons/fa';
import { FaBars, FaXmark } from 'react-icons/fa6';

const flags = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png',
  'https://cdn.britannica.com/79/5779-050-46C999AF/Flag-Saudi-Arabia.jpg'
];

const ChatTopNav = () => {
  const [flagIndex, setFlagIndex] = useState(1);
  const t = useTranslations('Home');
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for side menu visibility

  const HandleFlagPress = () => {
    const currentLocale = pathname.split("/")[1]; // Get the current locale (e.g., "en" or "ar")
    const newLocale = currentLocale === "en" ? "ar" : "en"; // Toggle the locale

    // Remove the current locale from the path and prepend the new locale
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
    router.push(`/${newLocale}${pathWithoutLocale}`);
  }

  useEffect(() => {
    setFlagIndex(pathname.split('/')[1] == 'ar' ? 0 : 1);
  })

  return (
    <header className="sticky top-0 z-50 h-12 md:h-16">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between h-auto">
            <section className="flex items-center justify-between w-full md:w-auto p-2">
              <div className="flex items-center">
                <Link href="/home">
                  <img className="h-8 md:h-12" src="/Resources/logo.jpg" alt="Logo" />
                </Link>
              </div>
              <div className="flex md:hidden items-center">
                <button onClick={() => setIsMenuOpen(true)}>
                  <FaBars size={20} />
                </button>
              </div>
            </section>
            <section className="hidden md:flex items-center space-x-4 md:w-auto justify-center md:justify-start">
              <button className="text-gray-500 p-2 rounded-md bg-gray-300 shadow-inner" title='chats'>
                <FaComments />
              </button>
              <Link href="/favourites" className="text-gray-700 p-2 rounded-md hover:bg-gray-300 hover:shadow-inner" title='favourites'>
                <FaHeart />
              </Link>
              <Link href="/profile" className="text-gray-700 p-2 rounded-md hover:bg-gray-300 hover:shadow-inner" title='profile'>
                <FaUser />
              </Link>
              <Link
                href='/add_listing'
                className="text-white p-3 rounded-md bg-yellow-400 hover:bg-yellow-500 hover:shadow-inner"
                title="place item for sale"
              >
                <FaPlus size={18} />
              </Link>
              <button onClick={HandleFlagPress} className="p-2 rounded-md hover:bg-gray-200">
                <img src={flags[flagIndex]} className="w-8 h-5 rounded-sm" />
              </button>
            </section>
          </div>
        </div>
      </nav>
      {/* Side Menu */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>
      <div
        className={`fixed top-0 right-0 w-full sm:w-2/5 h-full bg-white z-50 shadow-lg p-4 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center mb-4">
          <img
            src={'/favicon.ico'}
            className="w-8 h-8"
          />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-black"
          >
            <FaXmark size={24} />
          </button>
        </div>
        <nav className="flex flex-col pt-10 items-center text-2xl font-semibold h-full space-y-6">
          <button onClick={() => setIsMenuOpen(false)} className="text-blue-500">
            {t('chat')}
          </button>
          <Link href="/favourites" className="text-gray-700 hover:text-blue-500">
            {t('fav')}
          </Link>
          <Link href="/profile" className="text-gray-700 hover:text-blue-500">
            {t('profile')}
          </Link>
          <Link href='/add_listing' className="text-gray-700 hover:text-yellow-500">
            {t('addlisting')}
          </Link>
          <button
            onClick={HandleFlagPress}
            className="p-2 rounded-md hover:bg-gray-200"
          >
            <img src={flags[flagIndex]} className="w-8 h-5 rounded-sm" />
          </button>
        </nav>
      </div>
    </header>
  );
}
export default ChatTopNav