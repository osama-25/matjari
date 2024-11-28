'use client';
import React, { useState } from "react";
import ChatTopNav from "./TopNav";
import SideNav from "./SideNav";
import { FaArrowLeft } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function ChatLayout({ children }) {
    const [isPressed, setIsPressed] = useState(false);
    const pathname = usePathname();
    const locale = pathname.split("/")[1];
    const toggleOverlay = () => {
        setIsPressed(!isPressed);
    }
    return (
        <>
            <ChatTopNav />
            <div dir={locale == 'ar' ? 'rtl' : 'ltr'} className="flex">
                <div className={`flex-initial w-full sm:w-1/5 absolute sm:relative sm:block ${isPressed ? 'hidden' : 'block'}`}>
                    <SideNav onPress={toggleOverlay} />
                </div>
                <div className={`flex-1 p-4 sm:block ${isPressed ? 'block' : 'hidden'}`}>
                    <FaArrowLeft size={26} onClick={toggleOverlay} className="block sm:hidden" />
                    {children}
                </div>
            </div>
        </>
    );
}
