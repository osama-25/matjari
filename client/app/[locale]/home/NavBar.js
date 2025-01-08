"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaComments, FaHeart, FaPlus, FaSearch, FaUser } from "react-icons/fa";
import { FaBars, FaCamera, FaX, FaXmark } from "react-icons/fa6";
import { IoCamera, IoCameraOutline } from "react-icons/io5";
import { getInfo } from "../global_components/dataInfo";
import debounce from 'lodash/debounce';

const flags = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png",
  "https://cdn.britannica.com/79/5779-050-46C999AF/Flag-Saudi-Arabia.jpg",
];

const NavBar = () => {
  const t = useTranslations("Home");
  const [flagIndex, setFlagIndex] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for side menu visibility
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [newMessages, setNewMessages] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedFetchSuggestions = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search/suggestions?term=${encodeURIComponent(term)}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        console.log('Suggestions:', data.suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchSuggestions(value);
    setShowSuggestions(true);
  };


  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    router.push(`/search?term=${encodeURIComponent(suggestion)}&page=1&pageSize=10`);
  };

  const HandleFlagPress = () => {
    const currentLocale = pathname.split("/")[1];
    const newLocale = currentLocale === "en" ? "ar" : "en";
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  useEffect(() => {
    setFlagIndex(pathname.split('/')[1] === 'ar' ? 0 : 1);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getInfo();
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchNewMessages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/newmessages/${userId}`);
        const data = await response.json();
        console.log('New messages data:', data);
        if (data.hasNewMessages) {
          console.log('New messages:', data);
          setNewMessages(true);
        }
      } catch (error) {
        console.error('Error fetching new messages:', error);
      }
    }
    if (userId) {
      fetchNewMessages();
    }
  }, [userId]);

  const performSearch = async () => {

    if (!searchTerm.trim()) return;

    try {
      console.log('Search term: ', searchTerm);
      // Navigate to search results page
      router.push(`/search?term=${encodeURIComponent(searchTerm)}&page=1&pageSize=10`);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleImageSearch = (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageBase64 = reader.result.split(",")[1];
        const filename = file.name;
        const fileType = file.type;
        //convert base64 to imageURL
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/azure/upload`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              filename,
              fileType,
              imageBase64
            }),
          });

          if (!response.ok) {
            throw new Error(`Error uploading photo: ${photo.filename}`);
          }

          const result = await response.json();
          if (result.imgURL) {
            localStorage.removeItem('searchImageUrl');
            localStorage.setItem('searchImageUrl', result.imgURL);
            console.log('Search image URL:', result.imgURL);
            router.push(`/search?type=image`);
          } else {
            throw new Error('No image URL received from server');
          }
        } catch (error) {
          console.error("Error uploading photo:", error);
        }


      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleKeyDown = (e) => {
    // Check if the pressed key is 'Enter'
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <>
      <header>
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-row justify-between h-auto">
              <section className="flex items-center justify-between w-auto">
                <Link href="/home">
                  <img
                    className="hidden md:block md:h-12"
                    src="/Resources/logo.jpg"
                    alt="Logo"
                  />
                  <img
                    className="md:hidden h-6"
                    src="/favicon.ico"
                    alt="Logo"
                  />
                </Link>
              </section>
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center justify-center p-4 w-full md:w-auto">
                <div className="relative w-full max-w-3xl flex items-center">
                  {/* Search Bar */}
                  <div className="w-full relative z-auto">
                    <div className="flex items-center border-2 border-gray-600 focus:border-black relative z-auto rounded-full bg-white">
                      {/* Camera Icon */}
                      <label htmlFor="search-image" className="flex items-center p-3 rounded-full hover:bg-gray-100 cursor-pointer">
                      <input
                        data-testid="imgInput"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                        id="search-image"
                        onChange={handleImageSearch}
                      />
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 8C9.23858 8 7 10.2386 7 13C7 15.7614 9.23858 18 12 18C14.7614 18 17 15.7614 17 13C17 10.2386 14.7614 8 12 8ZM9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13Z" fill="#191919"></path>
                          <path fillRule="evenodd" clipRule="evenodd" d="M9.44152 2C8.15023 2 7.00381 2.82629 6.59547 4.05132L6.27924 5H3C1.34315 5 0 6.34315 0 8V19C0 20.6569 1.34314 22 3 22H21C22.6569 22 24 20.6569 24 19V8C24 6.34315 22.6569 5 21 5H17.7208L17.4045 4.05132C16.9962 2.82629 15.8498 2 14.5585 2H9.44152ZM8.49284 4.68377C8.62895 4.27543 9.01109 4 9.44152 4H14.5585C14.9889 4 15.3711 4.27543 15.5072 4.68377L16.0513 6.31623C16.1874 6.72457 16.5696 7 17 7H21C21.5523 7 22 7.44772 22 8V19C22 19.5523 21.5523 20 21 20H3C2.44772 20 2 19.5523 2 19V8C2 7.44772 2.44772 7 3 7H7C7.43043 7 7.81257 6.72457 7.94868 6.31623L8.49284 4.68377Z" fill="#191919"></path>
                        </svg>
                      </label>
                      {/* Search Input */}
                      <input
                        dir={pathname.split("/")[1] === "ar" ? "rtl" : "ltr"}
                        data-testid="searchInput"
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchInput}
                        onKeyDown={handleKeyDown}
                        className="w-full p-1 bg-white focus:outline-none rounded-full text-black"
                        placeholder={t("searchph")}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      />
                      {/* Search Icon */}
                      <span className="flex items-center p-3 text-gray-400">
                        <FaSearch size={16} color="black" />
                      </span>
                    </div>
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-0 left-0 right-0 mt-12 bg-white rounded-xl shadow-lg z-50">
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <span className="text-black font-medium truncate block">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </form>
              <div className="flex md:hidden items-center">
                <button onClick={() => setIsMenuOpen(true)}>
                  <FaBars />
                </button>
              </div>
              <section className="hidden md:flex items-center space-x-4 md:w-auto justify-center md:justify-start">
                <Link
                  href="/chats"
                  className="relative text-gray-700 p-2 rounded-md hover:bg-gray-300 hover:shadow-inner"
                  title="chats"
                >
                  <FaComments size={18} />
                  {newMessages && <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>}
                </Link>
                <Link
                  href="/favourites"
                  className="text-gray-700 p-2 rounded-md hover:bg-gray-300 hover:shadow-inner"
                  title="favourites"
                >
                  <FaHeart size={18} />
                </Link>
                <Link
                  href={'/profile'}
                  className="text-gray-700 p-2 rounded-md hover:bg-gray-300 hover:shadow-inner"
                  title="profile"
                >
                  <FaUser size={18} />
                </Link>
                <Link
                  href='/add_listing'
                  className="text-white p-3 rounded-md bg-yellow-400 hover:bg-yellow-500 hover:shadow-inner"
                  title="place item for sale"
                >
                  <FaPlus size={18} />
                </Link>
                <button
                  data-testid="flagBtn"
                  onClick={HandleFlagPress}
                  className="p-2 rounded-md hover:bg-gray-200"
                >
                  <img src={flags[flagIndex]} className="w-8 h-5 rounded-sm" />
                </button>
              </section>
            </div>
          </div>
        </nav>
      </header>
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
          <Link href="/chats" className="relative w-full flex justify-center items-center text-gray-700 hover:text-blue-500">
            {t('chat')}
            {newMessages && <span className="inline-block w-2 h-2 bg-red-600 rounded-full ml-2"></span>}
          </Link>
          <Link href="/favourites" className="text-gray-700 hover:text-blue-500">
            {t('fav')}
          </Link>
          <Link href={'/profile'} className="text-gray-700 hover:text-blue-500">
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
    </>
  );
};

export default NavBar;