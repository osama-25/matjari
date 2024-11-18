"use client";

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:8080");

export default function Chats() {
    const [message, setMessage] = useState("");
    const [AllMessages, setAllMessages] = useState([]);
    const [files, setFiles] = useState([]);
    const messagesEndRef = useRef(null);

    const room = 1;

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [AllMessages]);

    useEffect(() => {
        if (room) {
            socket.emit("join_room", room);
        }

        socket.on("receive_message", (data) => {
            setAllMessages((prevMessages) => [
                ...prevMessages,
                { message: data.content, sentByUser: true, files: data.files }
            ]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, [room]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:8080/chat/messages/${room}`);
                if (response.ok) {
                    const data = await response.json();
                    setAllMessages(data.map(msg => ({
                        message: msg.content,
                        sentByUser: msg.sent_by_user,
                        files: msg.files || []
                    })));
                }
            } catch (error) {
                console.error('Error retrieving messages:', error);
            }
        };

        fetchMessages();
    }, []);

    const sendMessage = async () => {
        if (message || files.length > 0) {
            const fileData = files.map(file => ({
                name: file.name,
                url: URL.createObjectURL(file),
                type: file.type
            }));

            const messageData = {
                content: message,
                room,
                sentByUser: true,
                files: fileData
            };

            try {
                const response = await fetch('http://localhost:8080/chat/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(messageData)
                });

                if (response.ok) {
                    socket.emit("sent_message", messageData);

                    setAllMessages((prevMessages) => [
                        ...prevMessages,
                        messageData
                    ]);
                    setMessage("");
                    setFiles([]);
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    };

    return (
        <div className="flex flex-col h-screen p-4 bg-gray-100">
            <h1 className="text-xl font-semibold text-blue-600 mb-4">Chat Room</h1>

            <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-md mb-4">
                {AllMessages.map((msg, index) => (
                    <div key={index} className={`p-2 rounded-lg ${msg.sentByUser ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'}`}>
                        <p>{msg.message}</p>
                        {msg.files && msg.files.map((file, fileIndex) => (
                            <div key={fileIndex} className="mt-2">
                                {file.type.startsWith("image") && (
                                    <img src={file.url} alt={file.name} className="w-24 h-auto rounded-md" />
                                )}
                                {file.type.startsWith("video") && (
                                    <video src={file.url} controls className="w-24 h-auto rounded-md" />
                                )}
                                {!file.type.startsWith("image") && !file.type.startsWith("video") && (
                                    <a href={file.url} download className="text-blue-500">{file.name}</a>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {files.length > 0 && (
                <div className="flex space-x-2 mb-4 justify-center">
                    {files.map((file, index) => (
                        <div key={index} className="relative">
                            {file.type.startsWith("image") && (
                                <img src={URL.createObjectURL(file)} alt={file.name} className="w-16 h-auto rounded-md" />
                            )}
                            {file.type.startsWith("video") && (
                                <video src={URL.createObjectURL(file)} controls className="w-16 h-auto rounded-md" />
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center space-x-2 mt-4">
                <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                    placeholder="Type a message..."
                    onChange={(event) => setMessage(event.target.value)}
                    value={message}
                />
                <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg cursor-pointer"
                >
                    Upload
                </label>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
