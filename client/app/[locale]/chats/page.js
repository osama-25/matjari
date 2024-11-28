import { useTranslations } from "next-intl";
import React from "react";

export default function Chats() {
    const t = useTranslations('Chat');

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-xl font-bold text-gray-600">{t('default')}</h2>
            <p className="mt-4 text-gray-400">{t('defaultdesc')}</p>
        </div>
    );
}