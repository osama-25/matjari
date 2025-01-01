'use client';
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import SideNav from "./SideNav";
export default function Chats() {
    const t = useTranslations('Chat');
    const pathname = usePathname();
    const locale = pathname.split("/")[1];
    const [isPressed, setIsPressed] = useState(false);

    const toggleOverlay = () => {
        setIsPressed(!isPressed);
    }

    return (
        <div dir={locale == 'ar' ? 'rtl' : 'ltr'} className="flex h-[90%]">
            <div className={`flex-initial w-full sm:w-1/5 h-full absolute sm:relative sm:block ${isPressed ? 'hidden' : 'block'}`}>
                <SideNav onPress={toggleOverlay} />
            </div>
            <div className='hidden sm:flex-1 p-2 sm:block'>
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h2 className="text-xl font-bold text-gray-600">{t('default')}</h2>
                    <p className="mt-4 text-gray-400">{t('defaultdesc')}</p>
                </div>
            </div>


        </div>


    );
}