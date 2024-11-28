'use client';
import Link from "next/link";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";

const chatRooms = [
    { id: 1, name: "Chat Room 1" },
    { id: 2, name: "Chat Room 2" },
    // Add more chat rooms as needed
];

const Button = ({ text, link, onClick }) => {
    return (
        <Link href={link} className="focus:bg-gray-200 focus:text-blue-600 hover:bg-gray-200 hover:text-blue-600 text-black my-1 rounded">
            <div onClick={onClick} className="w-full h-12 flex flex-row justify-center items-center gap-2">
                <span>{text}</span>
            </div>
        </Link>
    );
};

const SideNav = ({ onPress }) => {
    return (
        <nav className="h-[calc(100vh-2.5rem)] w-full text-white flex flex-col px-2 py-4 shadow-lg">
            {chatRooms.map(room => (
                <Button key={room.id} text={room.name} link={`/chats/${room.id}`} onClick={onPress} />
            ))}
        </nav>
    );
}
export default SideNav