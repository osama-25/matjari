'use client';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getInfo } from "../global_components/dataInfo";
import Loading from "../global_components/loading";

const Button = ({ text, link, onClick, hasNewMessages, photo, lastMessage, timestamp }) => {
    // Convert the timestamp to a Date object
    const date = new Date(timestamp);
    const now = new Date();

    // Helper to check if the date is the same day
    const isSameDay =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    // Format the date based on whether it's the same day
    const formattedDate = isSameDay
        ? date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        })
        : date.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });

    return (
        <Link
            href={link}
            className="focus:bg-gray-200 focus:text-blue-600 hover:bg-gray-200 hover:text-blue-600 text-black mb-1 rounded"
        >
            <div
                onClick={onClick}
                className="w-full h-20 flex flex-row justify-start items-center gap-4 relative px-6 border-b border-gray-100"
            >
                {photo && (
                    <img
                        src={photo}
                        alt={`${text} avatar`}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                )}
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">{text}</span>
                    </div>
                    <p className={`text-sm ${hasNewMessages ? 'text-black font-semibold' : 'text-gray-400'} truncate`}>{lastMessage}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-sm text-gray-500">{formattedDate}</span>
                    {hasNewMessages && (
                        <span className="inline-block w-2 h-2 bg-red-600 rounded-full mt-1"></span>
                    )}
                </div>
            </div>
        </Link>
    );
};

const SideNav = ({ onPress }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [roomsWithNewMessages, setRoomsWithNewMessages] = useState([]);


    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                // Fetch user info to get the user ID
                const result = await getInfo();
                const userId = result.id;
                setUserId(userId);

                // Fetch chat rooms for the user
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/get-rooms/${userId}`);
                const roomsData = await response.json();

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

    useEffect(() => {
        const fetchNewMessages = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/newmessages/${userId}`);
                const data = await response.json();
                console.log('New messages data:', data);
                setRoomsWithNewMessages(data.rooms);
                console.log(data.rooms);
            } catch (error) {
                console.error('Error fetching new messages:', error);
            }
        }
        if (userId) {
            fetchNewMessages();
        }
    }, [userId])

    if (loading) {
        return <Loading></Loading>
    }

    return (
        <nav className="h-full w-full flex flex-col px-2 py-8 rounded-md shadow-md">
            {chatRooms.length > 0 ? (
                chatRooms.map((room) => (
                    <Button
                        key={room.id}
                        text={room.user_name}
                        link={`/chats/${room.id}`}
                        onClick={onPress}
                        hasNewMessages={roomsWithNewMessages.includes(room.id)}
                        photo={room.photo || '/Resources/profile-pic.jpg'}
                        timestamp={room.timestamp}
                        lastMessage={room.last_message}
                    />
                ))
            ) : (
                <div>No chat rooms found</div>
            )}
        </nav>
    );
};

export default SideNav;
