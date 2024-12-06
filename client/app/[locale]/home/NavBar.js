"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaComments, FaHeart, FaPlus, FaSearch, FaUser } from "react-icons/fa";
import { FaBars, FaCamera, FaX, FaXmark } from "react-icons/fa6";
import { IoCamera, IoCameraOutline } from "react-icons/io5";

const flags = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png",
  "https://cdn.britannica.com/79/5779-050-46C999AF/Flag-Saudi-Arabia.jpg",
];

const NavBar = () => {
  const t = useTranslations("Home");
  const [isloggedIn, setIsloggedIn] = useState(1);
  const [flagIndex, setFlagIndex] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for side menu visibility
  const pathname = usePathname();
  const router = useRouter();

  const HandleFlagPress = () => {
    const currentLocale = pathname.split("/")[1];
    const newLocale = currentLocale === "en" ? "ar" : "en";
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  useEffect(() => {
    setFlagIndex(pathname.split('/')[1] === 'ar' ? 0 : 1);
  });

  const HandleProfilePress = () => {
    if (isloggedIn) {
      router.push("/profile");
    } else {
      router.push("/login");
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
              <div className="flex-1 flex items-center justify-center p-4 w-full md:w-auto">
                <button className="px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none">
                  <IoCamera size={24} />
                </button>
                <a className="w-full flex focus-within:outline rounded-md">
                  <input
                    dir={pathname.split("/")[1] === 'ar' ? 'rtl' : 'ltr'}
                    type="text"
                    className="w-full py-2 px-4 border text-black focus:outline-none"
                    placeholder={t('searchph')}
                  />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-r-md focus:outline-none">
                    <p className="hidden sm:block">{t("search")}</p>
                    <FaSearch className="block sm:hidden" />
                  </button>
                </a>
              </div>
              <div className="flex md:hidden items-center">
                <button onClick={() => setIsMenuOpen(true)}>
                  <FaBars />
                </button>
              </div>
              <section className="hidden md:flex items-center space-x-4 md:w-auto justify-center md:justify-start">
                <Link
                  href="/chats"
                  className="text-gray-700 p-2 rounded-md hover:bg-gray-300 hover:shadow-inner"
                  title="chats"
                >
                  <FaComments size={18} />
                </Link>
                <Link
                  href="/favourites"
                  className="text-gray-700 p-2 rounded-md hover:bg-gray-300 hover:shadow-inner"
                  title="favourites"
                >
                  <FaHeart size={18} />
                </Link>
                <button
                  onClick={HandleProfilePress}
                  className="text-gray-700 p-2 rounded-md hover:bg-gray-300 hover:shadow-inner"
                  title="profile"
                >
                  <FaUser size={18} />
                </button>
                <Link
                  href='/add_listing'
                  className="text-white p-3 rounded-md bg-yellow-400 hover:bg-yellow-500 hover:shadow-inner"
                  title="place item for sale"
                >
                  <FaPlus size={18} />
                </Link>
                <button
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
          <button onClick={HandleProfilePress} className="text-gray-700 hover:text-blue-500">
            {t('profile')}
          </button>
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