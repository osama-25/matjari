"use client";


import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { getInfo } from '../global_components/dataInfo';
import { FaArrowLeft, FaImage, FaPaperPlane, FaPlay, FaXmark } from 'react-icons/fa6';



const socket = io.connect("http://localhost:8080");

export default function Chats({ CloseChat }) {
    const [message, setMessage] = useState("");
    const [AllMessages, setAllMessages] = useState([]);
    const [files, setFiles] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const messagesEndRef = useRef(null);
    const [getId, setID] = useState();
    const room = 1;
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
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }

        console.log("ALLMESSAGES");
        console.log(AllMessages);

    }, [AllMessages]);

    useEffect(() => {

    }, [files])

    useEffect(() => {
        if (room) {
            socket.emit("join_room", room);
        }

        socket.on("receive_message", (data) => {
            setAllMessages((prevMessages) => [
                ...prevMessages,
                { message: data.content, sentByUser: getId, files: data.files }
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
                    console.log("########هنا###########");
                    console.log(data);


                    const userId = await getUserID();
                    setAllMessages(data.map(msg => ({
                        id: msg.id,
                        message: msg.content,
                        sentByUser: msg.sent_by_user,
                        url: msg.blob_data,
                        type: msg.blob_type,

                        files: msg.blob_data,

                    })));
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
                    const response = await fetch("http://localhost:8080/azure/upload", {
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
                type: uploadedFiles.filetype

            };

            setAllMessages((prevMessages) => [...prevMessages, {
                content: message,
                room,
                sentByUser: true,
                files: uploadedFiles,
                type: uploadedFiles.filetype
            }]);

            setRefresh(!refresh);




            try {
                const response = await fetch("http://localhost:8080/chat/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(messageData),
                });

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

        const filePreviews = uploadedFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setPreviewFiles((prevFiles) => [...prevFiles, ...filePreviews]);

        const filePromises = uploadedFiles.map((file) => {
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

    return (
        <div className="flex flex-col h-full p-1 md:p-4">
            {/* Chat Header */}
            <div className="flex items-center bg-white rounded-lg shadow-md p-2 mb-2">
                {/* Back Button for Smaller Screens */}
                <button
                    className="md:hidden bg-gray-300 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                    onClick={() => CloseChat()}
                >
                    <FaArrowLeft size={20} />
                </button>

                {/* Chat Info */}
                <div className="flex items-center space-x-3">
                    <img
                        src="/Resources/profile-pic.jpg" // Replace with dynamic photo URL
                        alt="Chat Avatar"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <h2 className="text-lg font-semibold text-gray-800">
                        Chat Name {/* Replace with dynamic chat name */}
                    </h2>
                </div>

                {/* Spacer for alignment */}
                <div className="hidden md:block w-10"></div>
            </div>

            {/* Render Messages */}
            <div dir='ltr' className="flex flex-col overflow-y-auto bg-white rounded-lg shadow-md mb-1 py-2">
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
                            className="relative bg-white rounded-lg max-w-3xl w-fit"
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


    // return (
    //     <div className="flex flex-col h-screen p-4 bg-gray-100">
    //         <h1 className="text-xl font-semibold text-blue-600 mb-4">Chat Room</h1>



    //         <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-md mb-4">
    //             {AllMessages.map((msg, index) => (

    //                 <div
    //                     key={index}

    //                     className={`p-2 rounded-lg ${parseInt(msg.sentByUser) === parseInt(getId) ? "bg-blue-100 text-right" : "bg-gray-200 text-left"}`}

    //                 >

    //                     {/* <h1>TESTING
    //                         <div> msg.sentByUser : {(msg.sentByUser)}</div>
    //                         <div> getId: {parseInt(getId)}</div>
    //                         <div> msg.sentByUser === getId: {parseInt(msg.sentByUser) === parseInt(getId) ? "YES" : "NO"}</div>

    //                     </h1> */}
    //                     {/* Display message content */}
    //                     <p>{msg.message}</p>

    //                     {/* Display files based on msg.type */}
    //                     {msg.files && (
    //                         <div className="mt-2">
    //                             {msg.type?.startsWith("image") && (
    //                                 <img
    //                                     src={msg.files}
    //                                     alt="Image"
    //                                     className="w-24 h-auto rounded-md"
    //                                 />
    //                             )}
    //                             {msg.type?.startsWith("video") && (
    //                                 <video
    //                                     src={msg.files}
    //                                     controls
    //                                     className="w-24 h-auto rounded-md"
    //                                 />
    //                             )}
    //                             {/* {!msg.type?.startsWith("image") &&
    //                                 !msg.type?.startsWith("video") && (
    //                                     <a
    //                                         href={msg.files}
    //                                         download
    //                                         className="text-blue-500"
    //                                     >

    //                                         {msg.split('/').pop() || "Download File"}
    //                                     </a>
    //                                 )} */}
    //                         </div>
    //                     )}
    //                 </div>
    //             ))}
    //             <div ref={messagesEndRef} />

    //         </div>



    //         <div className="flex items-center space-x-2 mt-4">
    //             <input
    //                 type="text"
    //                 className="flex-1 p-2 border border-gray-300 rounded-lg"
    //                 placeholder="Type a message..."
    //                 onChange={(event) => setMessage(event.target.value)}
    //                 value={message}
    //             />
    //             <input
    //                 type="file"
    //                 multiple
    //                 onChange={handleFileUpload}
    //                 className="hidden"
    //                 id="file-upload"
    //             />
    //             <label
    //                 htmlFor="file-upload"
    //                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg cursor-pointer"
    //             >
    //                 Upload
    //             </label>
    //             <button
    //                 className="px-4 py-2 bg-blue-500 text-white rounded-lg"
    //                 onClick={sendMessage}
    //             >
    //                 Send
    //             </button>
    //         </div>
    //     </div>
    // );
}
