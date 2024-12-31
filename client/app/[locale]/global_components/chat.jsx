"use client";


import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { getInfo } from './dataInfo';
import { FaArrowLeft, FaCheck, FaImage, FaPaperPlane, FaPlay, FaXmark } from 'react-icons/fa6';
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5';

import ReportButton from './report-button'; // Import ReportButton component
import { type } from 'os';
import Link from 'next/link';



const socket = io.connect(`${process.env.NEXT_PUBLIC_API_URL}`);

export default function Chats({ CloseChat, roomId, chatName, otherId }) {
    const [message, setMessage] = useState("");
    const [AllMessages, setAllMessages] = useState([]);
    const [files, setFiles] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const messagesEndRef = useRef(null);
    const [getId, setID] = useState();
    const room = roomId;
    const [modalContent, setModalContent] = useState(null); // To store the modal content
    const [isModalOpen, setIsModalOpen] = useState(false); // To track modal visibility
    const [hideSend, setHideSend] = useState(0);

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setModalContent(null);
        setIsModalOpen(false);
    };


    const getUserID = async () => {
        const info = await getInfo();
        setID(info.id);
        return info.id;

    };

    const markMessageAsSeen = async (messageId) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/mark-seen/${messageId}`);
        console.log(messageId);
        if (!response.ok) {
            throw new Error('Failed to mark message as seen');
        } else {
            socket.emit("mark_message_seen", { messageId, room });
        }

        return response.json();
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }

        console.log("ALLMESSAGES");
        console.log(AllMessages);
        console.log(new Date().toISOString());

        AllMessages.forEach(async (msg) => {
            if (!msg.seen && parseInt(msg.sentByUser) !== parseInt(getId)) {
                console.log("MARKING MESSAGE AS SEEN");
                msg.seen = true;
                await markMessageAsSeen(msg.id);
                console.log(msg);
                setAllMessages((prevMessages) =>
                    prevMessages.map((message) =>
                        message.id === msg.id ? { ...message, seen: true } : message
                    )
                );
            }
        });
    }, [AllMessages]);

    useEffect(() => {
        if (!room) return;

        // Join the chat room
        socket.emit("join_room", room);

        // Listener for receiving new messages
        socket.on("receive_message", (data) => {
            setAllMessages((prevMessages) => {
                // Check if the message already exists
                const existingMessage = prevMessages.find((msg) => msg.id === data.id);
                if (existingMessage) {
                    // Update existing message
                    return prevMessages.map((msg) =>
                        msg.id === data.id ? [...msg, { id: data.id, message: data.content, sentByUser: data.sentByUser, files: data.files[0].url, timestamp: data.timestamp, seen: data.seen, url: data.files[0].url, type: data.files[0].type }] : msg
                    );
                }
                // Add new message
                return [...prevMessages, { id: data.id, message: data.content, sentByUser: data.sentByUser, files: data.files[0].url, timestamp: data.timestamp, seen: data.seen, url: data.files[0].url, type: data.files[0].type }];
            });
        });

        // Listener for marking messages as seen
        socket.on("message_seen", ({ messageId }) => {
            setAllMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId ? { ...msg, seen: true } : msg
                )
            );
        });

        // Cleanup on room change or component unmount
        return () => {
            socket.off("receive_message");
            socket.off("message_seen");
        };
    }, [room]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {

                const userId = await getUserID();
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${room}/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("########هنا###########");
                    console.log(data);



                    setAllMessages(data.map(msg => ({
                        id: msg.id,
                        message: msg.content,
                        sentByUser: msg.sent_by_user,
                        url: msg.blob_data,
                        type: msg.blob_type,
                        seen: msg.seen,
                        timestamp: msg.timestamp,

                        files: msg.blob_data,

                    })));
                }
                else {
                    console.error('Error retrieving messages:', error);
                }

            } catch (error) {
                console.error('Error retrieving messages:', error);

            }
        };

        fetchMessages();
    }, [refresh]);
    const sendMessage = async () => {
        setHideSend(1);
        console.log(`M  =>  :${message}`);

        if (!message && files.length === 0) {
            console.log("NO DATA TO BE SENT");
            return;

        }

        // if (message || files.length > 0) {
        if (message || files.length > 0) {




            const fileUploadPromises = files.map(async (fileObj) => {
                const { file, base64 } = fileObj;

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/azure/upload`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            filename: file.name,
                            fileType: file.type,
                            imageBase64: base64,
                            storeInDataBase: 'chatting',
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();



                        setFiles([]);
                        setPreviewFiles([]);
                        return { url: data.imgURL, type: file.type };
                    } else {
                        console.error("Failed to upload file to server");
                        return null;
                    }
                } catch (error) {
                    console.error("Error uploading file:", error);
                    return null;
                }
            });

            const uploadedFiles = (await Promise.all(fileUploadPromises)).filter(Boolean);



            const messageData = {
                content: message,
                room,
                sentByUser: getId,
                files: uploadedFiles,
                type: uploadedFiles.filetype,
                seen: false,
                timestamp: new Date().toISOString(),
            };

            setAllMessages((prevMessages) => [...prevMessages, {
                content: message,
                room: roomId,
                sentByUser: getId,
                files: uploadedFiles,
                type: uploadedFiles.filetype,
                seen: false,
                timestamp: new Date().toISOString(),
            }]);

            setRefresh(!refresh);




            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(messageData),
                });
                const data = await response.json();
                messageData.id = data.id;
                console.log("Message Data:");
                console.log(messageData);

                if (response.ok) {
                    socket.emit("sent_message", messageData);
                    setMessage("");
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
            if (uploadedFiles.length > 0) {
                setFiles([]);
                setPreviewFiles([]);
            }
        }
        setHideSend(0);
    };

    const removeFile = (indexToRemove) => {
        setPreviewFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
        setFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };


    const handleFileUpload = async (event) => {
        const uploadedFiles = Array.from(event.target.files);

        // File size validation
        const validFiles = uploadedFiles.filter((file) => {
            if (file.type.startsWith("image/")) {
                return file.size <= 5 * 1024 * 1024; // Image file size <= 5MB
            } else if (file.type.startsWith("video/")) {
                return file.size <= 100 * 1024 * 1024; // Video file size <= 100MB
            } else {
                return false; // Ignore unsupported file types
            }
        });

        const invalidFiles = uploadedFiles.filter((file) => !validFiles.includes(file));
        if (invalidFiles.length > 0) {
            console.warn("Some files were skipped due to size limits:", invalidFiles);
            alert("Some files exceed the size limits and were not uploaded.");
        }

        // Generate file previews
        const filePreviews = validFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setPreviewFiles((prevFiles) => [...prevFiles, ...filePreviews]);

        // Convert valid files to base64
        const filePromises = validFiles.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ file, base64: reader.result.split(",")[1] });
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        try {
            const base64Files = await Promise.all(filePromises);
            setFiles((prevFiles) => [...prevFiles, ...base64Files]);
        } catch (error) {
            console.error("Error converting files to base64:", error);
        }
    };
    const handleKeyDown = (e) => {
        // Check if the pressed key is 'Enter'
        if (e.key === 'Enter') {
            sendMessage();
        }
    };
    useEffect(() => {

    }, [AllMessages]);

    useEffect(() => {
        const markseen = () => {
            AllMessages.map(async (msg) => {
                if (!msg.seen && msg.sentByUser != getId) {
                    await markMessageAsSeen(msg.id);
                    msg.seen = true;
                }
            });
        }
        if (getId) {
            markseen();
        }
    }, [getId])


    return (
        <div className="flex flex-col h-full p-1 md:p-4">
            {/* Chat Header */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-2 mb-2">
                {/* Back Button for Smaller Screens */}
                <button
                    className="md:hidden bg-gray-300 text-gray-700 hover:bg-gray-400 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                    onClick={() => CloseChat()}
                >
                    <FaArrowLeft size={20} />
                </button>
                {/* Chat Info */}
                <div className="flex items-center space-x-3 p-2">
                    <Link href={`/user/${otherId}`} className="text-lg font-semibold hover:underline text-gray-800">
                        {chatName}
                    </Link>
                </div>
                {/* Report Button */}
                <ReportButton userId={getId} />
            </div>

            {/* Render Messages */}
            <div dir='ltr' className="flex flex-col overflow-y-auto bg-white rounded-lg shadow-md mb-1 py-2 flex-grow flex-1">

                {AllMessages.map((msg, index) => (
                    <div key={index} className="w-full">
                        <div
                            className={`py-2 my-0.5 mx-4 w-fit max-w-xs h-fit rounded-xl ${parseInt(msg.sentByUser) === parseInt(getId)
                                ? "bg-gray-600 place-self-end rounded-tr-sm text-white"
                                : "bg-gray-300 place-self-start rounded-tl-sm"
                                }`}
                        >
                            {/* Display files */}
                            {msg.files && (
                                <div className="px-2 relative">
                                    {msg.type?.startsWith("image") && (
                                        <img
                                            src={msg.files}
                                            alt="Image"
                                            className="w-full max-w-60 h-full max-h-72 object-cover rounded-md cursor-pointer"
                                            onClick={() => openModal({ type: "image", src: msg.files })}
                                        />
                                    )}
                                    {msg.type?.startsWith("video") && (
                                        <div
                                            onClick={() =>
                                                openModal({ type: "video", src: msg.files })
                                            }
                                            className="cursor-pointer relative w-full max-w-48 h-full max-h-80 rounded-md overflow-hidden">
                                            <video
                                                src={msg.files}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                            <button className="absolute inset-0 place-self-center flex items-center justify-center bg-black bg-opacity-50 w-10 h-10 rounded-full">
                                                <FaPlay size={16} color='white' />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {msg.message && <p className="px-4">{msg.message}</p>}
                            <div className="flex justify-between items-center px-3">
                                <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {parseInt(msg.sentByUser) === parseInt(getId) && (msg.seen ? (
                                    <IoCheckmarkDone size={16} className='mx-2 text-blue-500' />
                                ) : (
                                    <IoCheckmark size={16} color="gray" className='mx-2' />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />

                {/* Modal for Image/Video */}
                {isModalOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                        onClick={closeModal}
                    >
                        <div
                            className="relative bg-white rounded-lg max-w-full w-full md:max-w-3xl md:w-fit mx-4"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
                        >
                            {modalContent?.type === "image" && (
                                <img
                                    src={modalContent.src}
                                    alt="Modal Content"
                                    className="w-full h-auto max-h-[80vh] object-contain rounded-md"
                                />
                            )}
                            {modalContent?.type === "video" && (
                                <video
                                    src={modalContent.src}
                                    controls
                                    autoPlay
                                    className="w-full h-auto max-h-[80vh] rounded-md"
                                />
                            )}
                            <button
                                className="absolute top-2 right-2 rounded-full p-2 bg-black bg-opacity-20"
                                onClick={closeModal}
                            >
                                <FaXmark size={24} color='white' />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* File Previews */}
            <div className="flex items-center space-x-2 mt-2">
                {previewFiles.map((fileObj, index) => (
                    <div key={index} className="relative p-4">
                        {fileObj.file.type.startsWith("image") && (
                            <img
                                src={fileObj.url}
                                alt={`Preview ${index}`}
                                className="w-24 h-auto rounded-md"
                            />
                        )}
                        {fileObj.file.type.startsWith("video") && (
                            <video
                                src={fileObj.url}
                                controls
                                className="w-24 h-auto rounded-md"
                            />
                        )}
                        <button
                            onClick={() => removeFile(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-sm p-1"
                        >
                            <FaXmark />
                        </button>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div dir='ltr' className="flex items-center space-x-2 mt-1">
                {/* Upload Button */}
                <label
                    htmlFor="file-upload"
                    className="w-14 h-14 bg-gray-300 text-gray-700 flex items-center justify-center rounded-full cursor-pointer shadow-md"
                >
                    <FaImage size={24} />
                </label>
                <input
                    type="file"
                    accept="video/*,image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                />

                {/* Text Input with Circular Send Button */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        className="w-full h-14 pl-4 pr-12 border border-gray-300 rounded-full focus:outline-none shadow-md"
                        placeholder="Type a message..."
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={handleKeyDown}
                        value={message}
                    />
                    <button
                        className={`${hideSend && 'opacity-20'} absolute top-1/2 right-1 transform -translate-y-1/2 bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md`}
                        onClick={sendMessage}
                        disabled={hideSend}
                    >
                        <FaPaperPlane size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
