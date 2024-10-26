"use client";
import NavBar from "./NavBar";
import Categories from "./Categories";
import ItemsDisplay from "./ItemsDisplay";
import AdDisplay from "./AdDisplay";
import React, { useState } from "react";
import Popup from "../popup";
import Link from "next/link";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const togglePopup = () => {
    setIsLoggedIn(!isLoggedIn);
  }

  return (
    <>
      <NavBar togglePopup={togglePopup} />
      <AdDisplay imageUrl={'https://opensooqui2.os-cdn.com/prod/public/images/homePage/spotlight/desktop/en/11-v2.webp'} altText={'AD'} />
      <Categories />
      <ItemsDisplay />

      {
        isLoggedIn &&
        <Popup title={'Login or Register'} togglePopup={togglePopup}>
          <div className="flex flex-col">
            <div className="m-2">
              <label htmlFor='email' className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name='email'
                id='email'
                className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
              />

            </div>
            <div className="self-center py-2">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Next
              </button>
            </div>
          </div>
        </Popup>
      }

      {/* <Button onClick={handleClick}> Testing Something </Button> */}
    </>
  );
}
