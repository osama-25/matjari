'use client';
import { FaPen } from "react-icons/fa";
import SideNav from "./SideNav";
import ProfileTopNav from "./TopNav";
import { useState } from "react";
import { FaX } from "react-icons/fa6";
import Popup from "../popup";
import { usePathname } from "next/navigation";

export default function ProfileLayout({ children }) {
    const pathname = usePathname();

    return (
        <>
            <ProfileTopNav />
            <div dir={pathname.split('/')[1] == 'ar' ? 'rtl' : 'ltr'} className="flex h-[calc(100vh-10px)]">
                <div className="flex-initial w-1/5">
                    <SideNav />
                </div>
                <div className="flex-1 p-4">
                    {children}
                </div>
            </div>
        </>
    );
}