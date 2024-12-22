
'use client';

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getInfo } from "../global_components/dataInfo";  // Assuming getInfo is properly defined elsewhere
import Loading from "../global_components/loading";
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
    const [chatRooms, setChatRooms] = useState([]);  // State to store chat rooms
    const [loading, setLoading] = useState(true);     // State to handle loading state


    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                // Fetch user info to get the user ID
                const result = await getInfo();
                const userId = result.id;
                console.log(userId);


                // Fetch chat rooms for the user
                const response = await fetch(`http://localhost:8080/chat/get-rooms/${userId}`);
                const roomsData = await response.json();
                console.log(userId);

                console.log(roomsData);


                // Set the fetched chat rooms into state
                setChatRooms(roomsData);

            } catch (error) {
                console.error("Error fetching chat rooms:", error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        fetchChatRooms();
    }, []);  // Empty dependency array means this runs once after the component mounts

    if (loading) {
        return <Loading></Loading>
    }

    return (

        <nav className="h-full w-full text-white flex flex-col px-2 py-8 rounded-md shadow-md">
            {chatRooms.length > 0 ? (
                chatRooms.map((room) => (
                    <Button key={room.id} text={room.user_name} link={`/chats/${room.id}`} onClick={onPress} />
                ))
            ) : (
                <div>No chat rooms found</div>
            )}
        </nav>
    );
};

export default SideNav;
