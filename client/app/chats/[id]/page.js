import React from "react";
import Chats from "@/app/chat-test/page";
const ChatRoom = ({ params }) => {
  return (
    <div className="flex justify-center items-center">
      <h2>Chat Room {params.id}</h2>
      <Chats></Chats>

    </div>

  );
}
export default ChatRoom