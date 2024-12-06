'use client';
import React, { useEffect, useRef, useState } from "react";
import SearchFilter from "../search/SearchFilter";
import ItemDisplay from "../search/ItemDisplay";

const Categories = [
    { id: 1, name: 'Electronics', image: '/favicon.ico', link: '/categories/electronics' },
    { id: 2, name: 'Fashion', image: '/favicon.ico', link: '/categories/fashion' },
    { id: 3, name: 'Home', image: '/favicon.ico', link: '/categories/home' },
    { id: 4, name: 'Books', image: '/favicon.ico', link: '/categories/books' },
    { id: 5, name: 'Toys', image: '/favicon.ico', link: '/categories/toys' },
    { id: 6, name: 'Beauty', image: '/favicon.ico', link: '/categories/beauty' },
    { id: 7, name: 'Sports', image: '/favicon.ico', link: '/categories/sports' },
    { id: 8, name: 'Automotive', image: '/favicon.ico', link: '/categories/automotive' },
    // Add more categories as needed
];

export default function categories() {
    const [isPressed, setIsPressed] = useState(false);
    const searchFilterRef = useRef(null);

    const toggleOverlay = () => {
        setIsPressed(!isPressed);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchFilterRef.current && !searchFilterRef.current.contains(event.target)) {
                setIsPressed(false);
            }
        };

        if (isPressed) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isPressed]);

    return (
        <>
            <div ref={searchFilterRef} className={`${isPressed? 'block': 'hidden'} w-2/4 absolute md:relative md:block md:w-1/4 block p-4 border-r border-gray-200 bg-white z-10`}>
                <SearchFilter Categories={Categories} Visible={isPressed} />
            </div>
            <ItemDisplay onPress={toggleOverlay} Visible={isPressed} />
        </>
    );
}