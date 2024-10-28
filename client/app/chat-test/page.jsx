"use client";

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:8080"); // Ensure this points to your backend server

export default function Chats() {
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState([]);
    const room = 1;

    // userId , sellerID

    // 10##11

    // roomId   idUseridSeller    
    //  idSelleridUser 
    // 
    

    // Join the room only once when the component mounts
    useEffect(() => {
        if (room) {
            socket.emit("join_room", room);
        }

        // Listen for new messages from the server
        socket.on("receive_message", (data) => {
            setMessageReceived((prevMessages) => [
                ...prevMessages,
                { message: data.content, sentByUser: false } // Messages from others
            ]);
        });

        // Clean up the event listener when the component unmounts
        return () => {
            socket.off("receive_message");
        };
    }, [room]);

    const sendMessage = async () => {
        if (message) {
            try {
                const response = await fetch('http://localhost:8080/chat/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: message,
                        room,
                        sentByUser: true
                    })
                });

                if (response.ok) {
                    // Emit the message via Socket.IO
                    socket.emit("sent_message", { content: message, room, sent_by_user: true });

                    // Add the user's message immediately to the UI
                    setMessageReceived((prevMessages) => [
                        ...prevMessages,
                        { message, sentByUser: true } // User's own messages
                    ]);
                    setMessage(""); // Clear input after sending
                } else {
                    console.error('Failed to send message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    // Load previous messages from the backend when the component mounts
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:8080/chat/messages/${room}`);
                if (response.ok) {
                    const data = await response.json();
                    setMessageReceived(data.map(msg => ({
                        message: msg.content,
                        sentByUser: msg.sent_by_user
                    })));
                } else {
                    console.error('Failed to retrieve messages');
                }
            } catch (error) {
                console.error('Error retrieving messages:', error);
            }
        };

        fetchMessages();
    }, [room]);

    return (
        <div className="flex flex-col items-center space-y-4 p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-blue-600">Chat Room</h1>
            <input
                className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                onChange={(event) => setMessage(event.target.value)}
                value={message}
            />
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={sendMessage}
            >
                Send Message
            </button>
            <h1>Messages:</h1>
            <div className="space-y-2 w-full max-w-md">
                {messageReceived.map((msg, index) => (
                    <p
                        key={index}
                        className={`p-2 rounded-lg ${msg.sentByUser ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'}`}
                    >
                        {msg.message}
                    </p>
                ))}
            </div>
        </div>
    );
}
