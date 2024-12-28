"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaComments, FaHeart, FaPlus, FaSearch, FaUser } from "react-icons/fa";
import { FaBars, FaCamera, FaX, FaXmark } from "react-icons/fa6";
import { IoCamera, IoCameraOutline } from "react-icons/io5";
import { getInfo } from "../global_components/dataInfo";

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
        const response = await fetch(`http://localhost:8080/chat/newmessages/${userId}`);
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
      setSearchTerm('');
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleImageSearch = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageBase64 = reader.result.split(",")[1];
        const filename = file.name;
        const fileType = file.type;
        //convert base64 to imageURL
        try {
          const response = await fetch("http://localhost:8080/azure/upload", {
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <label htmlFor="search-image" className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none cursor-pointer">
                  <input
                    data-testid="imgInput"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    id="search-image"
                    onChange={handleImageSearch}
                  />
                  <IoCamera size={24} className="text-white" />
                </label>
                <div className="w-full flex focus-within:outline rounded-md">
                  <input
                    dir={pathname.split("/")[1] === 'ar' ? 'rtl' : 'ltr'}
                    data-testid="searchInput"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full py-2 px-4 border text-black focus:outline-none"
                    placeholder={t('searchph')}
                  />
                  <button
                    data-testid="searchBtn"
                    type="submit"
                    onClick={performSearch}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md focus:outline-none"
                  >
                    <p className="hidden sm:block">{t("search")}</p>
                    <FaSearch className="block sm:hidden" />
                  </button>
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
          <Link href="/chats" className="text-gray-700 hover:text-blue-500">
            {t('chat')}
          </Link>
          <Link href="/favourites" className="text-gray-700 hover:text-blue-500">
            {t('fav')}
          </Link>
          <Link href={'/profile'} className="text-gray-700 hover:text-blue-500">
            {t('profile')}
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