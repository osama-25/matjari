import React from "react";
import ChatTopNav from "./TopNav";
import SideNav from "./SideNav";

export default function ChatLayout({ children }) {
    return (
        <>
            <ChatTopNav />
            {children}
        </>
    );
}
