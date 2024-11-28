import { HomeItem, Item } from "@/app/[locale]/Item";
import { useTranslations } from "next-intl";
import React from "react";

const items = [
    { id: 1, name: 'Electronics', image: '/favicon.ico', link: '/electronics' },
    { id: 2, name: 'Fashion', image: '/favicon.ico', link: '/fashion' },
    { id: 3, name: 'Home', image: '/favicon.ico', link: '/home' },
    { id: 4, name: 'Books', image: '/favicon.ico', link: '/books' },
    { id: 5, name: 'Books', image: '/favicon.ico', link: '/books' },
];

const Store = () => {
    const t = useTranslations('Profile');
    return (
        <section className="border rounded border-gray-300 p-2 flex flex-col h-full">
            <h1 className="m-2 font-bold">{t('store')}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center overflow-y-auto flex-grow">
                {items.map(item => (
                    <Item id={item.id} key={item.id} name={item.name} image={item.image} link={item.link} price={'$$$'} />
                ))}
            </div>
        </section>
    );
}
export default Store