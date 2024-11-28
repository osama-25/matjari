import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { HomeItem, Item } from "../Item";
import { useTranslations } from "next-intl";

const items = [
    { id: 1, name: 'Electronics', image: '/favicon.ico' },
    { id: 2, name: 'Fashion', image: '/favicon.ico' },
    { id: 3, name: 'Home', image: '/favicon.ico' },
    { id: 4, name: 'Books', image: '/favicon.ico' },
    { id: 5, name: 'Fashion', image: '/favicon.ico' },
    { id: 6, name: 'Home', image: '/favicon.ico' },
];

const ItemsDisplay = () => {
    const t = useTranslations('Home');
    return (
        <div className="flex flex-col px-6 py-2">
            {/* Header Section - Sticky */}
            <div className="flex justify-end top-0 z-10 py-2">
                <button className="flex items-center">
                    <b>{t('seemore')}</b>
                    <FaArrowRight className="w-auto h-auto p-2" />
                </button>
            </div>

            {/* Scrollable Items Section */}
            <div className="grid grid-cols-3 sm:flex sm:space-x-10 overflow-y-auto mt-2 no-scrollbar">
                {items.map(item => (
                    <Item key={item.id} id={item.id} name={item.name} image={item.image} price={'$$$'} heart={false} />
                ))}
            </div>
        </div>
    )
}
export default ItemsDisplay