'use client';
import React, { useEffect, useState } from "react";
import Chats from "../../chat-test/page";
import { useParams, usePathname } from "next/navigation";
import SideNav from "../SideNav";

const ChatRoom = ({ params }) => {
  const [isPressed, setIsPressed] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const toggleOverlay = () => {
    setIsPressed(!isPressed);
  }

  // const id = use(params).id

  return (
    <div dir={locale == 'ar' ? 'rtl' : 'ltr'} className="flex h-[90%]">
      <div className={`flex-initial w-full sm:w-1/5 h-full absolute sm:relative sm:block ${isPressed ? 'hidden' : 'block'}`}>
        <SideNav onPress={toggleOverlay} />
      </div>
      <div className={`flex-1 p-2 sm:block ${isPressed ? 'block' : 'hidden'}`}>
        <Chats room={2}

          CloseChat={toggleOverlay} />
      </div>
    </div>
  );
}
export default ChatRoom