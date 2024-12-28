'use client';
import React, { use, useEffect, useState } from "react";
import Chats from "../../chat-test/page";
import { usePathname } from "next/navigation";
import SideNav from "../SideNav";
import { getInfo } from "../../global_components/dataInfo";


const ChatRoom = ({ params }) => {
  const [isPressed, setIsPressed] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const id = use(params).id;
  const [chatName, setChatName] = useState('');

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        // Fetch user info to get the user ID
        const result = await getInfo();
        const userId = result.id;


        // Fetch chat rooms for the user
        const response = await fetch(`http://localhost:8080/chat/get-rooms/${userId}`);
        const roomsData = await response.json();
        

        const room = roomsData.find(room => room.id == id);
        if (room) {
          setChatName(room.user_name);
        }
        // Set the fetched chat rooms into state

      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    fetchChatRooms();
  }, []);

  const toggleOverlay = () => {
    setIsPressed(!isPressed);
  }

  return (
    <div dir={locale == 'ar' ? 'rtl' : 'ltr'} className="flex h-[90%]">
      <div className={`flex-initial w-full sm:w-1/5 h-full absolute sm:relative sm:block ${isPressed ? 'hidden' : 'block'}`}>
        <SideNav onPress={toggleOverlay} />
      </div>
      <div className={`flex-1 p-2 sm:block ${isPressed ? 'block' : 'hidden'}`}>
        <Chats 
          chatName={chatName}
          roomId={id}
          CloseChat={toggleOverlay}
        />
      </div>
    </div>
  );
}
export default ChatRoom