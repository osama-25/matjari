'use client';
import React, { use, useState } from "react";
import Chats from "../../global_components/chat";
import { usePathname } from "next/navigation";
import SideNav from "../SideNav";
import Reportpage from '../../global_components/report'


const ChatRoom = ({ params }) => {
  const [isPressed, setIsPressed] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const toggleOverlay = () => {
    setIsPressed(!isPressed);
  }


  const id = use(params).id;
  console.log(id);


  return (
    <div dir={locale == 'ar' ? 'rtl' : 'ltr'} className="flex h-[90%]">
      <div className={`flex-initial w-full sm:w-1/5 h-full absolute sm:relative sm:block ${isPressed ? 'hidden' : 'block'}`}>
        <SideNav onPress={toggleOverlay} />
      </div>
      <div className={`flex-1 p-2 sm:block ${isPressed ? 'block' : 'hidden'}`}>
        <Chats room={2}
          roomId={id}
          CloseChat={toggleOverlay}

        />
      </div>

    </div>
  );
}
export default ChatRoom